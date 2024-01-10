import * as os from 'os';
import * as path from "path";
import * as process from "process";
import data_json from "./data.json";
import {throws} from "node:assert";
import Doctor from "./models/doctor";
import mongoose from "mongoose";
import Message from "./models/message";


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
        const message_data= await Message.find({
            $or:[
                {sender: "658fb70b04de584edb3886d4", receiver: "659beda2ac9d72ded814c6c0"},
                {sender: "659beda2ac9d72ded814c6c0", receiver: "658fb70b04de584edb3886d4"}
            ],
            sentAt: {
                $gt: new Date('2024-01-10T11:36:48.646219')
            }
        })
        console.log(message_data);
    } catch (e) {
        console.error(e)
    }
}
main().then(r => {
    console.log("Done")
    process.exit()
});