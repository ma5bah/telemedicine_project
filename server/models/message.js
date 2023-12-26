const mongoose = require("mongoose");
const { userSchema } = require("./user");
// enum MessageType {
//     TEXT,
//     MEDICINE,
//     VIDEOCALL,
// }
const messageSchema = mongoose.Schema({
    data: {
        type: String,
        required: true
    },
    sender: {
        type: userSchema,
        required: true
    },
    receiver: {
        type: userSchema,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    sentAt: {
        type: Number,
        required: true
    },
});

const Message = mongoose.model("Message", messageSchema);
module.exports = {Message,messageSchema};