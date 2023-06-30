import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

export const initExpress = (app) => {
    const tempApp = express();

    tempApp.use(cors());
    tempApp.use(express.static('public'));
    tempApp.use(bodyParser.json());
    tempApp.use(bodyParser.urlencoded({ extended: true }))

    return tempApp;
}

import { getUser, getUsers, deleteUser } from '../services/repo.js';

export const initRouter = (app) => {
    const routerUser = express.Router();

    routerUser.get('/', async (req, res) => {
        let rfid = req.query.rfid;

        if (rfid !== undefined) {
            res.send(await getUser(rfid))
        } else {
            res.send(await getUsers())
        }
    })

    routerUser.delete('/', async (req, res) => {
        let rfid = req.query.rfid;

        if (rfid !== undefined) {
            res.send(await deleteUser(rfid))
        }
    })

    app.use('/users', routerUser);
}

import * as mqtt from "mqtt"
import { mqttOnConnect, mqttOnMessage } from '../services/mqtt.js';
import { mqttOptions } from '../config.js';

export const initMQTT = () => {
    const mqttClient = mqtt.connect('mqtt://broker.emqx.io')
    Object.assign(mqttClient.options, mqttOptions)

    mqttClient.on("connect", () => { mqttOnConnect(mqttClient) })
    mqttClient.on("message", (topic, payload) => { mqttOnMessage(mqttClient, topic, payload) })

    return mqttClient;
}


import { initializeApp, cert } from 'firebase-admin/app';
import firebaseConfig from '../serviceAccountKey.json' assert { type: "json" };
import { getFirestore } from "firebase-admin/firestore";

export const initFirebase = () => {
    const firebaseApp = initializeApp({
        credential: cert(firebaseConfig),
    });

    const database = getFirestore(firebaseApp);

    return database;
}