import * as os from 'os';
import * as path from "path";
import * as process from "process";
import data_json from "./data.json";
import {throws} from "node:assert";
import Doctor from "./models/doctor";
import mongoose from "mongoose";


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
        const doctor_data = await Doctor.find({
            speciality: {
                $regex: regex
            }
        })
        console.log(doctor_data.length);
        for (let j = 0; j < doctor_data.length; j++) {
            await Doctor.findByIdAndUpdate(doctor_data[j]._id, {
              userId: doctor_data[j].userId,
            })
            console.log("Updated " + doctor_data[j].userId);
        }
    } catch (e) {
        console.error(e)
    }
}
main().then(r => {
    console.log("Done")
    process.exit()
});