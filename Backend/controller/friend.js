import { Friend } from "../model/friend.model.js";
import { User } from "../model/user.model.js";
import { Group } from "../model/grp.model.js";

const GetFriend = async (req, res) => {
    console.log("GetFriend Function Called");

    const { user } = req.body;

    if (!user) {
        return res.status(400).json({ error: "User is required." });
    }

    let userObject;
    try {
        userObject = JSON.parse(user);
    } catch (error) {
        return res.status(400).json({ error: "Invalid user format." });
    }

    try {
        const friendList = await Friend.findOne({ 'user._id': userObject._id });

        if (!friendList) {
            console.log("Friend list not found for user:", userObject);
            return res.status(404).json({ error: "Friend list not found." });
        }

        // Extract the friend's user IDs
        const all_friends_id = friendList.friends.map(friend => friend.user._id);

        // Fetch user details for all friends
        const all_friends = await User.find(
            { _id: { $in: all_friends_id } },
            { _id: 1, email: 1, name: 1, profilePicture: 1 } // Ensure profilePicture is used consistently
        );
        // Fetch groups where user is a member, with admin details populated
        const all_members_grp = await Group.find(
            { _id: { $in: all_friends_id } },
            { _id: 1, name: 1, profilePicture: 1, admin: 1 }
        ).populate({
            path: 'admin',
            select: '_id email', // Retrieve both _id and email fields from the admin document
        });

        // Format the response to include admin _id and email directly
        const formatted_groups = all_members_grp.map(group => ({
            _id: group._id,
            name: group.name,
            admin: group.admin._id,
            email: group.admin.email,
            profilePicture: group.profilePicture,
        }));

        const all_profiles = [...all_friends, ...formatted_groups];


        // Log the raw data retrieved from the database
        // console.log("Raw Friend List Data", all_friends);


        // Return the formatted friend list to the client
        res.status(200).json(all_profiles);
        console.log("Friend List Fetched Successfully");

    } catch (err) {
        console.error("Error in Fetching Friend List", err);
        res.status(500).json({ error: "Error in fetching friend list." });
    }
};




async function helper_set_friend(userDetail, friendDetail) {
    try {
        const friendList = await Friend.findOne({ 'user._id': userDetail._id });


        if (friendList) {
            // Check if the friend is already in the list
            const isFriendExist = friendList.friends.some(friend => (friend.user._id == friendDetail._id));
            // const isFriendExist = friendList.friends.some(friend => { console.log(friend.user._id);return true});

            if (isFriendExist) {

                console.log("Friend already added.");
            } else {
                friendList.friends.push({ user: friendDetail });
                const updatedFriendList = await friendList.save();
                console.log("Friend Added Successfully", updatedFriendList.friends);
            }
        } else {
            const newFriend = new Friend({
                user: userDetail,
                friends: [{ user: friendDetail }]
            });

            const savedFriend = await newFriend.save();

            console.log("Friend Added Successfully", savedFriend.friends);
        }
    } catch (err) {

        console.log("Error in Adding Friend", err);
    }
}


async function SetFriend(req, res) {
    console.log("SetFriend Function Called");

    const { user, friend_email } = req.body;

    if (!user || !friend_email) {
        res.status(400).json({ error: "User and friend email are required." });
        return;
    }

    let userObject;
    try {
        userObject = JSON.parse(user);
    } catch (error) {
        res.status(400).json({ error: "Invalid user format." });
        return;
    }

    const friendObject = await User.findOne({ email: friend_email });


    if (!friendObject) {
        res.status(404).json({ error: "Friend Not Found" });
        console.log("Friend Not Found");
        return;
    }


    const userDetail = {
        _id: userObject._id,
    };

    const friendDetail = {
        _id: friendObject._id.toString(),
    };

    // console.log("User Detail", userDetail);
    // console.log("Friend Detail", friendDetail);


    try {
        await helper_set_friend(userDetail, friendDetail);
        await helper_set_friend(friendDetail, userDetail);

        console.log("Friend Added Successfully");

    } catch (error) {

        console.log("Error in Adding Friend", error);
    }


}



export { GetFriend, SetFriend };
