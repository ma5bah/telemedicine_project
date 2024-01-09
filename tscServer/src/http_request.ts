import * as os from 'os';
import * as path from "path";
import * as process from "process";
import data_json from "./data.json";
import {throws} from "node:assert";


const main = async () => {
    for (let i = 0; i < data_json.length; i++) {
        // console.log(data_json[i]);
        try {
            const doc_data = data_json[i];
            const email = doc_data.name.replace(/\s/g, "").toLowerCase() + "@gmail.com";
            const password = "Test@123";
            const signup_data = await fetch("http://127.0.0.1:3000/api/signup", {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    "name": doc_data.name,
                    "email": email,
                    "password": password,
                })
            })
                .then((response) => response.json())
                .catch((error) => throws(error));
            const login_data = await fetch("http://127.0.0.1:3000/api/signin", {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    "email": email,
                    "password": password,
                })
            })
                .then((response) => response.json());
            const createdoctor_data = await fetch("http://127.0.0.1:3000/doctor_api/create_doctor", {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OGM0MDMwOTQ4ZmZjNGNmYmNlMjFmNyIsImlhdCI6MTcwNDcxMDk3M30.cVa9FaNmFdh4sIYhtQO6m_Oo_quFxE8I2Ki2fkcnYs0'
                }),
                body: JSON.stringify({
                    "user_id": login_data._doc._id,
                    "image_url": doc_data.image,
                    "speciality": doc_data.speciality,
                    "degree": doc_data.degree,
                    "designation": doc_data.designation,
                    "workplace": doc_data.workplace,
                    "fees": 1000,
                })
            })
                .then((response) => response.json());
            console.log(createdoctor_data);
        } catch (e) {
            console.error(e)
        }
    }
}
main();