import express from "express";

const doctorRouter = express.Router();
import auth from "../middlewares/auth";
import Chat from "../models/chat";
import mongoose, {Schema} from "mongoose";
import Doctor from "../models/doctor";
import User, {UserType} from "../models/user";
import WaitingQueue from "../models/appointment";
import Appointment from "../models/appointment";
import admin from "../middlewares/admin";
import message, {MessageType} from "../models/message";
// import  from "mongodb";


doctorRouter.post("/doctor_api/start_consult", auth, async (req, res) => {
    const doctor_profile = await Doctor.findOne({
        userId: req.user
    })
    if (!doctor_profile) return res.status(400).send("Doctor not found");
    const list_of_patients = await WaitingQueue.find({
        doctorId: doctor_profile.userId,
        lastActive: {
            $lt: Date.now() - 2 * 60 * 1000
        }
    }).sort({createdAt: "descending"});
    return res.send(list_of_patients);
    // doctor_profile.onConsultation = true;
    // const real_queue = doctor_profile.waitingQueue;
    //
    // let temp_queue = [];
    // let cnt = 0
    // for (let i = 0; i < real_queue.length; i++) {
    //     if (real_queue[i].isOnline) {
    //         temp_queue.push({
    //             ...real_queue[i],
    //             serialNumber: cnt,
    //         });
    //         cnt++;
    //     }
    // }
    // for (let i = 0; i < real_queue.length; i++) {
    //     if (!real_queue[i].isOnline) {
    //         temp_queue.push({
    //             ...real_queue[i],
    //             serialNumber: cnt,
    //         });
    //         cnt++
    //     }
    // }
    // // @TODO: it is best make a separate waiting queue model and perform all the operations there
    // const user_data = doctor_profile.waitingQueue[0];
    // doctor_profile.withPatient = user_data.userId;
    // await doctor_profile.save();
    // let chat = await Chat.findOne({
    //     $or: [
    //         {user_one: req.user, user_two: user_data.userId},
    //     ]
    // });
    // if (!chat) {
    //     chat = new Chat({
    //         user_one: doctor_profile.userId,
    //         user_two: user_data.userId,
    //         messages: [],
    //     })
    //     await chat.save();
    // }
    // chat.messages.push({
    //     sender: doctor_profile.userId,
    //     receiver: user_data.userId,
    //     message: "Consultation started",
    //     timestamp: Date.now(),
    // });
    // await chat.save();

    // @TODO: send notification to user
    // @TODO: can we ensure that user is online?
})
doctorRouter.post("/doctor_api/accept_consult", auth, async (req, res) => {
})
doctorRouter.post("/doctor_api/end_consult", auth, async (req, res) => {
})
doctorRouter.post("/doctor_api/request_consult", auth, async (req, res) => {
    const user_data = await User.findOne({
        _id: req.user
    })
    if (!user_data) return res.status(400).send("User not found");
    const list_of_appointments = await Appointment.find({
        userId: req.user
    })
    for (let i = 0; i < list_of_appointments.length; i++) {
        let doctor_data = await Doctor.findOne({
            _id: list_of_appointments[i].doctorId
        })
        if (!doctor_data) continue;

        if (!doctor_data.onConsultation && doctor_data.isOnline) {
            doctor_data.waitingQueue.push({
                userId: req.user,
                doctorId: list_of_appointments[i].doctorId,
                createdAt: list_of_appointments[i].createdAt,
                lastActive: Date.now()
            })
            await doctor_data.save();
        }
    }

})
doctorRouter.get("/doctor_api/get_waiting_serial_number", auth, async (req, res) => {
    const appointment_data = await Appointment.findOne({
        shouldGetDoneWithin: {
            $gt: Date.now()
        },
        isDone: false,
        userId: req.user
    })
    if (!appointment_data) return res.status(400).send("Appointment not found");
    let serialNumber = -1;
    await Appointment.countDocuments({
        createdAt: {
            $lt: appointment_data.createdAt
        }
    }, (err: any, count: number) => {
        if (err) return res.status(400).send("Error in fetching serial number");
        serialNumber = count;
    })

    return res.send({serialNumber: serialNumber});
})


doctorRouter.post("/doctor_api/set_user_online", auth, async (req, res) => {
    try {
        const appointment_data = await Appointment.updateMany({
            userId: req.user,
        }, {
            lastActive: Date.now()
        })
        return res.send({
            message: "You are online now",
            appointment_data: `${appointment_data.modifiedCount} appointments updated`
        })
    } catch (error: any) {
        return res.status(400).send(error.message);
    }
})
doctorRouter.get("/doctor_api/get_user_online_list", auth, async (req, res) => {
    try {
        const appointment_data = await Appointment.find({
            doctorId: req.user,
        }).sort({
            createdAt: "descending"
        }).limit(20)
        return res.send({
            appointment_data: appointment_data
        })
    } catch (error: any) {
        return res.status(400).send(error.message);
    }
})


// doctorRouter.post("/doctor_api/get_all_doctor", async (req, res) => {
//     const doctor_data = await Doctor.find({})
//     return res.send(doctor_data);
// })

doctorRouter.post("/doctor_api/search_doctor_by_category", auth, async (req, res) => {
    const {category} = req.body;
    // if (!category) {
    //     const doctor_data = await Doctor.find()
    //     return res.send(doctor_data);
    // }
    const regex = new RegExp(category, 'i') // i for case insensitive
    const doctor_data = await Doctor.find({
        speciality: {
            $regex: regex
        }
    }).populate("userId");
    console.log(doctor_data[0]);
    return res.send(doctor_data);
})
doctorRouter.post("/doctor_api/create_doctor", admin, async (req, res) => {
    const {user_id, image_url, speciality, degree, designation, workplace, fees} = req.body;
    console.log(req.body);
    if (!user_id) return res.status(400).send("User Id is required");
    if (!image_url) return res.status(400).send("Image URL is required");
    if (!speciality) return res.status(400).send("Speciality is required");
    if (!degree) return res.status(400).send("Degree is required");
    if (!designation) return res.status(400).send("Designation is required");
    if (!workplace) return res.status(400).send("Workplace is required");
    if (!fees) return res.status(400).send("Fees is required");
    if (!Number.isInteger(fees)) return res.status(400).send("Fees should be a number");
    const user = await User.findOne({
        _id: user_id
    })
    if (!user) return res.status(400).send("User not found");

    const doctor_profile = await Doctor.create({
        userId: user_id,
        onConsultation: false,
        withPatient: "",
        waitingQueue: [],
        image_url: image_url,
        speciality: speciality,
        degree: degree,
        designation: designation,
        workplace: workplace,
        fees: fees,
        rating: 0,
    })
    user.doctor_data = doctor_profile._id;
    user.type = UserType.DOCTOR;
    await user.save();
    res.send(doctor_profile);
});
doctorRouter.post("/doctor_api/create_appointment", auth, async (req, res) => {
    const {doctor_id} = req.body;
    if (!doctor_id) return res.status(400).send("Doctor Id is required");

    const [doctor_profile, user_data] = await Promise.all([
        Doctor.findOne({
            userId: doctor_id,
        }),
        User.findOne({
            _id: req.user
        })
    ]);

    // console.log(await Doctor.findById(new Schema.ObjectId(doctor_id)));
    if (!doctor_profile) return res.status(400).send("Doctor not found");
    // return res.send(doctor_profile);
    // console.log(await Doctor.findOne({
    //     userId: doctor_id
    // }));
    if (!user_data) return res.status(400).send("User not found");
    if (doctor_profile.fees > user_data.balance) return res.status(400).send("Insufficient balance");
    const previous_appointent_data = await Appointment.findOne({
        doctorId: doctor_profile.userId,
        userId: req.user,
        isDone: false,
        shouldGetDoneWithin: {
            $gt: Date.now()
        }
    });
    if (!!previous_appointent_data) return res.status(200).json({
        message: "You already have an appointment with this doctor",
        appointment_data: previous_appointent_data
    });
    const [appointment_data, doctor_user_profile] = await Promise.all([
        Appointment.create({
            doctorId: doctor_profile.userId,
            userId: req.user,
            isDone: false,
            shouldGetDoneWithin: Date.now() + 2 * 24 * 60 * 60 * 1000,
        }),
        User.findOne({
            _id: doctor_profile.userId
        })
    ])
    if (!doctor_user_profile) return res.status(400).send("Doctor user not found");
    // @TODO: make payment according to doctor fees if user already took appointment
    user_data.balance = user_data.balance - doctor_profile.fees;
    doctor_user_profile.balance = doctor_user_profile.balance + doctor_profile.fees;
    await Promise.all([
        user_data.save(),
        doctor_user_profile.save(),
    ])

    let chat = await Chat.findOne({
            user_one: doctor_profile.userId, user_two: req.user
        }
    );
    if (!chat) {
        chat = new Chat({
            user_one: doctor_profile.userId,
            user_two: req.user,
            messages: [],
        })
    }
    chat.messages.push({
        sender: doctor_profile.userId,
        receiver: req.user,
        data: "Appointment created",
        type: MessageType.TEXT,
        sentAt: Date.now(),
    });
    await chat.save();

    return res.json({
        message: "Appointment created successfully",
        appointment_data: appointment_data
    });
});

export default doctorRouter;
