import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";
import nodemailer from "nodemailer"
import bycrypt from "bcrypt";
import { hashPassword } from "./user.js";


async function Login(req, res) {
    const { email, password } = req.body;
    console.log("Login ", req.body);

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.send({ error: `User with ${email} not found` });
        }

        // Check if password is correct
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.send({ error: "Invalid Password" });
        }


        // Generate refresh token
        const refreshToken = jwt.sign({ user: user }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1h' });

        // Send success response with tokens
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
        });



        res.send({ success: "Login Successful", user });
        // console.log("Login Successful", user, refreshToken);

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}



async function ForgetPassword(req, res) {
    try {
        const email = req.body?.email;

        // Validate the email
        if (!email) {
            return res.status(400).send({ error: "Email not provided." });
        }

        // Setup email transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SERVER_EMAIL,
                pass: process.env.SERVER_PASSWORD, // Use app-specific password for 2FA
            },
        });

        // Generate OTP (this should be replaced with an actual OTP generation method)
        const otp = generateOTP(); // Create a function to generate a secure OTP
        const expirationTime = new Date(Date.now() + 1000 * 60 * 5); // 5 minutes from now
        const unixMilliseconds=Date.now() + 1000 * 60 * 5;



        // Formatting the expiration time
        const formattedExpirationTime = formatExpirationTime(expirationTime);

        // Message to be sent in the email
        const message = `Your OTP for resetting your password is: ${otp}. It is valid until ${formattedExpirationTime}.`;

        // Log the message for debugging (consider removing in production)
        console.log(`OTP Email Message: ${message}`);

        // Email options
        const mailOptions = {
            from: process.env.SERVER_EMAIL,
            to: email,
            subject: "Reset Password - Chat App",
            text: message,
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to:", email);

        // save the otp in the database with the email, expiration time and the otp
        await User.findOneAndUpdate({
            email: email
        }, {
            forgetPassword: {
                otp,
                unixMilliseconds,
            }

        })
        // Respond to the client
        res.status(200).send({ message: "OTP has been sent to your email." });

    } catch (error) {
        console.error("Error in sending OTP email:", error);
        res.status(500).send({ error: "Failed to send OTP. Please try again later." });
    }
}

// Function to generate a secure OTP
function generateOTP() {
    // Replace this with your actual OTP generation logic
    return Math.floor(100000 + Math.random() * 900000).toString(); // Example: 6-digit OTP
}

// Function to format expiration time
function formatExpirationTime(expirationTime) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return expirationTime.toLocaleString(undefined, options);
}


async function verifyOTP(req, res) {
    try {
        const { email, otp,password } = req.body;

        // Validate the email and OTP
        if (!email || !otp ) {

            return res.status(400).send({ error: "Email or OTP not provided." });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ error: "User not found." });
        }

        // Check if the OTP exists and if it's expired
        if (!user.forgetPassword) {
            return res.status(400).send({ error: "No OTP was generated or it has already expired." });
        }

        const currentTime = Date.now();
        if (currentTime > user.forgetPassword.unixMilliseconds) {
            // OTP has expired, clear the OTP and expiration time
            user.forgetPassword.otp = undefined;
            user.forgetPassword.unixMilliseconds = undefined;
            await user.save();
            return res.status(400).send({ error: "OTP has expired. Please request a new one." });
        }


        // Verify the OTP
        if (user.forgetPassword.otp !== otp) {
            console.log("OTP INVALID",user.forgetPassword.otp,otp);
            return res.status(400).send({ error: "Invalid OTP." });
        }

        // OTP is valid, clear the OTP and expiration
        user.forgetPassword.otp = undefined;
        user.forgetPassword.unixMilliseconds = undefined;
        
        // Set the new password (hash it before saving)
        const hashedPassword = await hashPassword(password);
        console.log("Hashed Password",hashedPassword);
        // Update the user's password
        user.password = hashedPassword;
        

        await user.save();

        // Proceed with password reset (or any other action)
        res.status(200).send({ message: "OTP verified successfully. Proceed with password reset." });
    } catch (error) {
        console.error("Error in verifying OTP:", error);
        res.status(500).send({ error: "Failed to verify OTP. Please try again later." });
    }
}


export { ForgetPassword, verifyOTP };
export default Login;
