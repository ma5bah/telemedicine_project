const mongoose = require("mongoose");
const { userSchema } = require("./user");
const {messageSchema} = require("./message");
const chatSchema = mongoose.Schema({
    user_one: {
        type: userSchema,
        required: true
    },
    user_two: {
        type: userSchema,
        required: true
    },
    messages: [messageSchema]
});

const Chat = mongoose.model("Chat", chatSchema);
module.exports = {Chat};