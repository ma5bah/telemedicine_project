import express from "express";
import auth from "../middlewares/auth";
import Chat from "../models/chat";
import mongoose from "mongoose";
import User from "../models/user";
import Appointment from "../models/appointment";
import {MessageType} from "../models/message";
import chat from "../models/chat";

const inboxRouter = express.Router();

inboxRouter.get("/telemedicine_api/inbox", auth, async (req, res) => {
    const chats = await Chat.find({
        $or: [
            {user_one: new mongoose.Types.ObjectId(req.user)},
            {user_two: new mongoose.Types.ObjectId(req.user)}
        ],
    });
    const appointment_data = await Appointment.find({
        $or: [
            {doctorId: req.user, isDone: false, shouldGetDoneWithin: {$gt: Date.now()}},
            {userId: req.user, isDone: false, shouldGetDoneWithin: {$gt: Date.now()}}
        ]
    });
    let chat_data = chats.map((chat) => {
        let appointment = appointment_data.find((appointment) => {
            return (appointment.doctorId == chat.user_one && appointment.userId == chat.user_two)
                || (appointment.doctorId == chat.user_two && appointment.userId == chat.user_one)
        })
        return {
            chat: chat,
            appointment: appointment
        }
    });
    return res.send(chats);
});
inboxRouter.get("/telemedicine_api/send_message", auth, async (req, res) => {
    if (!req.body.receiver || !req.body.message) return res.status(400).send("Receiver and message is required");
    const {receiver, message} = req.body;
    let messageType = MessageType.TEXT;
    if (req.body.type) {
        if (req.body.type === "VIDEO") {
            messageType = MessageType.VIDEOCALL;
        } else if (req.body.type === "MEDICINE") {
            messageType = MessageType.MEDICINE;
        }
    }
    if (req.user === receiver) return res.status(400).send("You cannot send message to yourself");
    const [sender, receiver_data] = await Promise.all([
        User.findOne({_id: req.user}),
        User.findOne({_id: receiver})
    ])
    if (!receiver_data) return res.status(400).send("Receiver not found");
    if (!sender) return res.status(400).send("Sender not found");
    let [chat_data, appointment_data] = await Promise.all([
        Chat.findOne({
            $or: [
                {user_one: req.user, user_two: receiver},
                {user_one: receiver, user_two: req.user}
            ]
        }),
        Appointment.findOne({
            $or: [
                {doctorId: receiver, userId: req.user, isDone: false, shouldGetDoneWithin: {$gt: Date.now()}},
                {doctorId: req.user, userId: receiver, isDone: false, shouldGetDoneWithin: {$gt: Date.now()}}
            ]
        })
    ])
    if (!appointment_data) {
        return res.status(400).send("There is no appointment between you and receiver");
    }
    if (!chat_data) {
        return res.status(400).send("There is no chat between you and receiver");
    }
    chat_data.messages.push({
        sender: req.user,
        receiver: receiver,
        type: messageType,
        sentAt: Date.now(),
        data: message
    })
    await chat_data.save();
    return res.send(chat_data);
});


export default inboxRouter;
