import * as os from 'os';
import * as path from "path";
import * as process from "process";
import data_json from "./data.json";
import {throws} from "node:assert";
import Doctor from "./models/doctor";
import mongoose from "mongoose";
import Message from "./models/message";
import Chat from "./models/chat";
import io from 'socket.io-client';

const main = async () => {

    const DB = "mongodb+srv://cuet:NZkkDUPWip0uAN3K@cluster0.1xfncjc.mongodb.net/?retryWrites=true&w=majority";
    await mongoose
        .connect(DB)
        .then(() => {
            console.log("Connection Successful");
        })
        .catch((e) => {
            console.log(e);
        });
    try {
        const externalSocket = io("http://192.168.0.100:3000");
        externalSocket.on('connect', () => {
            console.log('Connected to server');

            // Send a message to the server when connected
            externalSocket.emit('chat message', 'Hello from external client');
        });

        externalSocket.on('chat message', (msg: string) => {
            console.log('Received message from server:', msg);
        });

        externalSocket.on('disconnect', () => {
            console.log('Disconnected from server');
        });
        setTimeout(() => {
            externalSocket.emit('chat message', 'Delayed message from external client');
        }, 3000);
    } catch (e) {
        console.error(e)
    }
}
main().then(r => {
    // console.log("Done")
    process.exit()
});