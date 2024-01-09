import mongoose from "mongoose";
import {userSchema} from "./user";
import {messageSchema} from "./message";

const chatSchema = new mongoose.Schema({
    on_video_call: {
        type: Boolean,
        required: true,
        default: false
    },
    start_consultation_request_by_doctor: {
        type: Boolean,
        required: true,
        default: false
    },
    user_one: {
        type: String,
        required: true
    },
    user_two: {
        type: String,
        required: true
    },
    messages: [messageSchema]
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;