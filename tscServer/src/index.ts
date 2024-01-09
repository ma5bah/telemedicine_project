// IMPORTS FROM PACKAGES
import express from "express";

import mongoose from "mongoose";
import CronJob from "node-cron";
// IMPORTS FROM OTHER FILES
import adminRouter from "./routes/admin";
import authRouter from "./routes/auth";
import productRouter from "./routes/product";
import userRouter from "./routes/user";
import inboxRouter from "./routes/inbox";
import WaitingQueue from "./models/appointment";
import doctorRouter from "./routes/doctor";

// INIT
const PORT = process.env.PORT && Number.parseInt(process.env.PORT) || 3000;
const app = express();
const DB = "mongodb+srv://u1904001:VFUnbKhh2Rp9ZSZd@cluster0.1xfncjc.mongodb.net/?retryWrites=true&w=majority";

// middleware
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);
app.use(inboxRouter);
app.use(doctorRouter);

// Connections
mongoose
    .connect(DB)
    .then(() => {
        console.log("Connection Successful");
    })
    .catch((e) => {
        console.log(e);
    });
// const scheduledJobFunction = CronJob.schedule("*/5 * * * *", () => {
//     console.log("I'm executed on a schedule!");
//     WaitingQueue.updateMany({
//         lastActive: {
//             $lt: new Date(Date.now() - 5 * 60 * 1000)
//         }
//     }, {
//         $set: {
//             lastActive: new Date()
//         }
//     }, {
//         multi: true
//     }, (err, res) => {
//         if (err) console.log(err);
//         console.log(res);
//     })
//     // Add your custom logic here
// });
//
// scheduledJobFunction.start();
app.listen(PORT, "0.0.0.0", () => {
    console.log(`connected at port ${PORT}`);
});
