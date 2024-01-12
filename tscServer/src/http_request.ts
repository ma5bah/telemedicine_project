import * as os from 'os';
import * as path from "path";
import * as process from "process";
import data_json from "./data.json";
import {throws} from "node:assert";
import Doctor from "./models/doctor";
import mongoose from "mongoose";
import Message from "./models/message";
import Chat from "./models/chat";


const main = async () => {

    const DB = "mongodb+srv://u1904001:VFUnbKhh2Rp9ZSZd@cluster0.1xfncjc.mongodb.net/?retryWrites=true&w=majority";
    mongoose
        .connect(DB)
        .then(() => {
            console.log("Connection Successful");
        })
        .catch((e) => {
            console.log(e);
        });
    try {
        // const doc_data = data_json[i];
        // const email = doc_data.name.replace(/\s/g, "").toLowerCase() + "@gmail.com";
        const password = "Test@123";
        const regex = new RegExp("Specialist", 'i') // i for case insensitive
        const chats = await Chat.find({
                user_one: "659bf115ac9d72ded814e46a",
            }
        )
        console.log(chats);
    } catch (e) {
        console.error(e)
    }
}
main().then(r => {
    console.log("Done")
    process.exit()
});