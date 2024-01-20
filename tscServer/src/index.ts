import express from "express";
import mongoose from "mongoose";
import {Server} from "socket.io";


import adminRouter from "./routes/admin";
import authRouter from "./routes/auth";
import productRouter from "./routes/product";
import userRouter from "./routes/user";
import inboxRouter from "./routes/inbox";
import WaitingQueue from "./models/appointment";
import doctorRouter from "./routes/doctor";
import * as http from "http";
import jwt from "jsonwebtoken";
import {passkey} from "./middlewares/auth";
import Message, {MessageType} from "./models/message";
import User, {UserType} from "./models/user";
import Chat from "./models/chat";
import Appointment from "./models/appointment";

// INIT
const PORT = process.env.PORT && Number.parseInt(process.env.PORT) || 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const DB = "mongodb+srv://cuet:NZkkDUPWip0uAN3K@cluster0.1xfncjc.mongodb.net/?retryWrites=true&w=majority";

enum SocketEvents {
    CHAT_MESSAGE = 'chat_message',
    ERROR_EVENT = 'error',
    SEND_MESSAGE = 'send_message',
    CHAT_MESSAGE_EVENT = 'chat_message_event',
    GET_MESSAGE = 'get_message',
    GET_MESSAGE_RESPONSE = 'get_message_response',
}

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('subscribe', (roomName) => {
        socket.join(roomName);
        console.log(`Socket joined room: ${roomName}`);
        // console.log(socket.rooms);
        // console.log(io.sockets.adapter.rooms.get(roomName));
    });
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    socket.on(SocketEvents.SEND_MESSAGE, async (data) => {
        try {
            // Extract required data from the incoming message
            const {receiver, message, type, authToken} = data;

            // Check for required fields
            if (!receiver || !message || !authToken) {
                socket.emit(SocketEvents.ERROR_EVENT, 'receiver, message and authToken are required');
                return;
            }
            const verified = jwt.verify(authToken, passkey) as jwt.JwtPayload;
            if (!verified) {
                socket.emit(SocketEvents.ERROR_EVENT, 'Invalid auth token');
                return;
            }
            // Handle message type
            let messageType = MessageType.TEXT;
            if (type) {
                if (type === 'VIDEO') {
                    messageType = MessageType.VIDEOCALL;
                } else if (type === 'MEDICINE') {
                    messageType = MessageType.MEDICINE;
                }
            }

            // Check if the sender and receiver are the same user
            if (verified.id === receiver) {
                socket.emit(SocketEvents.ERROR_EVENT, 'You cannot send a message to yourself');
                return;
            }

            // Assuming you have a function to retrieve user data by ID
            const [sender, receiverData] = await Promise.all([
                User.findOne({_id: verified.id}),
                User.findOne({_id: receiver})
            ])

            // Check if the receiver exists
            if (!receiverData) {
                socket.emit(SocketEvents.ERROR_EVENT, 'Receiver not found');
                return;
            }

            // Check if the sender exists
            if (!sender) {
                socket.emit(SocketEvents.ERROR_EVENT, 'Sender not found');
                return;
            }

            // Assuming you have functions to find or create a chat and an appointment
            const [chatData, appointmentData] = await Promise.all([
                Chat.findOne({
                    $or: [
                        {user_one: verified.id, user_two: receiver},
                        {user_one: receiver, user_two: verified.id}
                    ]
                }),
                Appointment.findOne({
                    $or: [
                        {doctorId: receiver, userId: verified.id},
                        {doctorId: verified.id, userId: receiver}
                    ]
                    // $or: [
                    //     {doctorId: receiver, userId: req.user, isDone: false, shouldGetDoneWithin: {$gt: Date.now()}},
                    //     {doctorId: req.user, userId: receiver, isDone: false, shouldGetDoneWithin: {$gt: Date.now()}}
                    // ]
                })
            ])

            // Check if there is an appointment between the sender and receiver
            if (!appointmentData) {
                socket.emit(SocketEvents.ERROR_EVENT, 'There is no appointment between you and the receiver');
                return;
            }

            // Check if there is a chat between the sender and receiver
            if (!chatData) {
                socket.emit(SocketEvents.ERROR_EVENT, 'There is no chat between you and the receiver');
                return;
            }

            // Create a new message
            const newMessage = new Message({
                sender: verified.id,
                receiver: receiver,
                type: messageType,
                sentAt: new Date(Date.now()),
                data: message,
            });

            // Save the new message
            await newMessage.save();

            // Update the chat with the new message
            chatData.messages.push(newMessage._id);
            await chatData.save();

            // Emit the message to the receiver
            io.to(receiver).to(verified.id).emit(SocketEvents.CHAT_MESSAGE_EVENT, {
                message: [newMessage],
            });
            // console.log(chatData.messages);
        } catch (error) {
            console.error(error);
            socket.emit(SocketEvents.ERROR_EVENT, 'Internal server error');
        }
    });


    socket.on('chat message', (msg) => {
        console.log('Received message:', msg);
        io.emit('chat message', msg);
    });
    socket.on('msg', (data) => {
        console.log('Received message:', data);
    })
});

// middleware
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);
app.use(inboxRouter);
app.use(doctorRouter);

// Connections
mongoose
    .connect(DB)
    .then(() => {
        console.log("Connection Successful");
    })
    .catch((e) => {
        console.log(e);
    });
server.listen(PORT, "0.0.0.0", () => {
    console.log(`connected at port ${PORT}`);
});
// const scheduledJobFunction = CronJob.schedule("*/5 * * * *", () => {
//     console.log("I'm executed on a schedule!");
//     WaitingQueue.updateMany({
//         lastActive: {
//             $lt: new Date(Date.now() - 5 * 60 * 1000)
//         }
//     }, {
//         $set: {
//             lastActive: new Date()
//         }
//     }, {
//         multi: true
//     }, (err, res) => {
//         if (err) console.log(err);
//         console.log(res);
//     })
//     // Add your custom logic here
// });
//
// scheduledJobFunction.start();
// socket.on(SocketEvents.GET_MESSAGE, async (data) => {
//     let messageData;
//     const {authToken, receiver} = data;
//     if (!receiver || !authToken) {
//         socket.emit(SocketEvents.ERROR_EVENT, 'Receiver is required');
//         return;
//     }
//     const verified = jwt.verify(authToken, passkey) as jwt.JwtPayload;
//     if (!verified) {
//         socket.emit(SocketEvents.ERROR_EVENT, 'Invalid auth token');
//         return;
//     }
//     if (!data.time) {
//         messageData = await Message.find({
//             $or: [
//                 {sender: verified.id, receiver: data.receiver},
//                 {receiver: verified.id, sender: data.receiver},
//             ],
//         });
//     } else {
//         messageData = await Message.find({
//             $or: [
//                 {sender: verified.id, receiver: data.receiver},
//                 {receiver: verified.id, sender: data.receiver},
//             ],
//             sentAt: {$gt: Date.parse(data.time)},
//         });
//     }
//
//     socket.emit(SocketEvents.CHAT_MESSAGE_EVENT, {
//         messages: messageData,
//     });
// });
