import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

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

export default Login;
