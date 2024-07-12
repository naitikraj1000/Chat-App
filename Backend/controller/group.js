import { Group } from "../model/grp.model.js";
import { User } from "../model/user.model.js";
import { Friend } from "../model/friend.model.js";
import mongoose from "mongoose";


async function set_grp_friend(grp_id, member_id) {

    // check if the grp_id is present in friend (User_id)
    const memberList = await Friend.findOne({ 'user._id': member_id });

    if (!memberList) {
        return;
    }


    const isMemberExist = memberList.friends.some(friend => (friend.user._id == grp_id));

    if (isMemberExist) {
        console.log("Member Already Exist in Group");
        return;
    } else {

        console.log("Adding Member in Group ");
        memberList.friends.push({ user: { _id: grp_id } });
        const updatedmemberList = await memberList.save();
        console.log("Member Added Successfully");
    }



}

async function CreateGroup(req, res) {
    const { name, members, admin } = req.body;
    console.log("Create Group", name, members, admin);

    try {


        const newGroup = new Group({
            name: name,
            members: members,
            admin: admin
        });

        const data = await newGroup.save();
        console.log("Group Created Successfully", data);
        await set_grp_friend(data._id, admin);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: "Error creating group" });
        console.log("Error in Creating Group", err);
    }
}

async function AddMemberInGroup(req, res) {
    const { group_id, email } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const member_id = user._id;
    console.log("Add Member in Group", member_id, group_id);

    try {
        // Check if the group exists
        const group = await Group.findById(group_id);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        // Check if user is already in group
        if (group.members.includes(member_id)) {
            return res.status(400).json({ error: "User is already a member of this group" });
        }

        // Add user to the group
        group.members.push(member_id);
        await group.save();

        await set_grp_friend(group_id, member_id);

        res.status(200).json({ message: "Friend added to group successfully", group });
    } catch (err) {
        console.error("Error in Adding Friend to Group", err);
        res.status(500).json({ error: "Error adding friend to group" });
    }
}

async function GetMembers(req, res) {
    const { group_id } = req.body;
    console.log("Get Members", req.body);

    try {
        // Find the group
        const group = await Group.findById(group_id);

        if (!group) {
            console.log("Group not found:", group_id);
            return res.status(404).json({ error: "Group not found." });
        }

        // Extract the member IDs
        const member_ids = group.members;

        // Fetch user details for all members
        const members = await User.find(
            { _id: { $in: member_ids } },
            { _id: 1, email: 1, name: 1, profilePicture: 1 }
        );

        // Log the raw data retrieved from the database
        // console.log("Raw Member Data", members);

        // Return the member list to the client
        res.status(200).json(members);
        console.log("Group Members Fetched Successfully");

    } catch (err) {
        console.error("Error in Fetching Group Members", err);
        res.status(500).json({ error: "Error in fetching group members." });
    }
}

export { CreateGroup, AddMemberInGroup, GetMembers };