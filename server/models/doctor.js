const mongoose = require("mongoose");
const { userSchema } = require("./user");
const {messageSchema} = require("./message");
const doctorSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    specialization: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    qualification: {
        type: String,
        required: true,
    },
    fees: {
        type: String,
        required: true,
    },
    rating: {
        type: String,
        required: true,
    },
});

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = { Doctor};