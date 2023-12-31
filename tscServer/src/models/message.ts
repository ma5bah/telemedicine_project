import mongoose from "mongoose";
import {userSchema} from "./user";

export enum MessageType {
    TEXT,
    VIDEOCALL,
    MEDICINE,
}

export const messageSchema = new mongoose.Schema({
    data: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    sentAt: {
        type: Date,
        required: true
    },
});

const Message = mongoose.model("Message", messageSchema);
export default Message