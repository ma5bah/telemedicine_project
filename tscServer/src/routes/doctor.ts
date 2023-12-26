import express from "express";
const doctorRouter = express.Router();
import auth from "../middlewares/auth";
import Chat from "../models/chat";
import mongoose from "mongoose";

// doctorRouter.get("/telemedicine_api/inbox", auth, async (req, res) => {
//     console.log(req.user);
//     const chats = await Chat.find({
//         $or: [
//             {user_one: mongoose.Types.ObjectId(req.user)},
//             {user_two: mongoose.Types.ObjectId(req.user)}
//         ],
//     })
//     console.log(chats);
//     res.send(chats)
//     // return res.send("inbox", { chats });
// });
//

export default doctorRouter;
