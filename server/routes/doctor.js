const express = require("express");
const inboxRouter = express.Router();
const auth = require("../middlewares/auth");
const {Chat} = require("../models/chat");
const mongoose = require("mongoose");
const {mongo} = require("mongoose");

inboxRouter.get("/telemedicine_api/inbox", auth, async (req, res) => {
    console.log(req.user);
    const chats = await Chat.find({
        $or: [
            {user_one: mongoose.Types.ObjectId(req.user)},
            {user_two: mongoose.Types.ObjectId(req.user)}
        ],
    })
    console.log(chats);
    res.send(chats)
    // return res.send("inbox", { chats });
});


module.exports = inboxRouter;
