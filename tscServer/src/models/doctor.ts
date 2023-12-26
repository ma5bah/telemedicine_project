import mongoose, {Types} from "mongoose";
import {userSchema} from "./user";
import {messageSchema} from "./message";

const doctorSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    onConsultation: {
        type: Boolean,
        required: true,
        default: false,
    },
    patient: {
        type: String,
        required: false,
    },
    waitingQueue: [String],
    specialization: {
        type: String,
        required: true,
    },
    experience: {
        type: Number,
        required: true,
    },
    qualification: {
        type: String,
        required: true,
    },
    fees: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
});

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor