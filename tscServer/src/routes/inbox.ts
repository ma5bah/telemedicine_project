import express from "express";

const inboxRouter = express.Router();
import auth from "../middlewares/auth";
import Chat from "../models/chat";
import mongoose from "mongoose";
import Doctor from "../models/doctor";
import User from "../models/user";

inboxRouter.get("/telemedicine_api/inbox", auth, async (req, res) => {
    const chats = await Chat.find({
        $or: [
            {user_one: new mongoose.Types.ObjectId(req.user)},
            {user_two: new mongoose.Types.ObjectId(req.user)}
        ],
    })
    return res.send(chats);
});
inboxRouter.get("/telemedicine_api/get_appointment", auth, async (req, res) => {
    if (!req.body.doctorId) return res.status(400).send("Doctor Id is required");
    const {doctorId} = req.body;
    let chat = await Chat.findOne({
        $or: [
            {user_one: new mongoose.Types.ObjectId(req.user), user_two: new mongoose.Types.ObjectId(doctorId)},
            {user_one: new mongoose.Types.ObjectId(doctorId), user_two: new mongoose.Types.ObjectId(req.user)}
        ],
    })
    let [doctor_data, my_data] = await Promise.all([
        User.findOne({
            _id: doctorId
        }).populate("doctor_data"),
        User.findOne({
            _id: req.user
        })
    ])
    if (!doctor_data) return res.status(400).send("Doctor not found");
    if (!my_data) return res.status(500).send("Internal error");
    if (!chat) {
        chat = new Chat({
            user_one: req.user,
            user_two: doctorId,
            messages: [],
        })
        await chat.save();
        // if(doctor_data.doctor_data!==null&&doctor_data.doctor_data!==undefined){
        //     doctor_data.doctor_data.
        // }
        // my_data.balance = my_data.balance - (!doctor_data.doctor_data)?0:doctor_data.doctor_data.fees;
        // await my_data.save();
        // doctor_data.balance = doctor_data.balance + doctor_data.fees;
    }
    return res.send(doctor_data);
});
inboxRouter.get("/telemedicine_api/send_message", auth, async (req, res) => {
    if (!req.body.receiver || !req.body.message) return res.status(400).send("Receiver and message is required");
    const {receiver, message} = req.body;
    let chat = await Chat.findOne({
        $or: [
            {user_one: req.user, user_two: receiver},
            {user_one: receiver, user_two: req.user}
        ]
    })
    if (!chat) {
        chat = new Chat({
            user_one: req.user,
            user_two: receiver,
            messages: [{
                sender: req.user,
                receiver: receiver,
                type: "TEXT",
                sentAt: Date.now(),
                data: message
            }],

        })
        await chat.save();
    } else {
        chat.messages.push({
            sender: req.user,
            receiver: receiver,
            type: "TEXT",
            sentAt: Date.now(),
            data: message
        })
        await chat.save();
    }
    return res.send(chat);
});


export default inboxRouter;
