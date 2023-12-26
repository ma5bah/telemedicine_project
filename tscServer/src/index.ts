// IMPORTS FROM PACKAGES
import express from "express";

import mongoose from "mongoose";

import adminRouter from "./routes/admin";
// IMPORTS FROM OTHER FILES
import authRouter from "./routes/auth";
import productRouter from "./routes/product";
import userRouter from "./routes/user";
import inboxRouter from "./routes/inbox";
// INIT
const PORT = process.env.PORT && Number.parseInt(process.env.PORT) || 3000;
const app = express();
const DB =
    "mongodb+srv://u1904001:VFUnbKhh2Rp9ZSZd@cluster0.1xfncjc.mongodb.net/?retryWrites=true&w=majority";

// middleware
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);
app.use(inboxRouter);

// Connections
mongoose
    .connect(DB)
    .then(() => {
        console.log("Connection Successful");
    })
    .catch((e) => {
        console.log(e);
    });

app.listen(PORT, "0.0.0.0", () => {
    console.log(`connected at port ${PORT}`);
});
