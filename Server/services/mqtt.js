import { updateUserStatus, registerUser, deleteUser } from './repo.js';

const topicRFID = "VinhH/rfid"
const topicRFIDApp = "VinhH/rfid/app"

const topicAdmin = "VinhH/rfid/admin"
const topicAdminDelete = "VinhH/rfid/admin/delete"
const topicAdminRegister = "VinhH/rfid/admin/register"

export const mqttOnConnect = (client) => {
    console.log("connected to mqtt broker");

    client.subscribe(topicRFID, { qos: 1 }, null)
    client.subscribe(topicAdminDelete, { qos: 1 }, null)
    client.subscribe(topicAdminRegister, { qos: 1 }, null)
    client.subscribe(topicRFIDApp, { qos: 1 }, null)
}

export const mqttOnMessage = (mqtt, topic, payload) => {
    const payloadString = payload.toString()
    const topicString = topic.toString()

    console.log(`Topic: ${topicString}`);
    console.log(`Payload: ${payloadString}`);

    switch (topicString) {
        case topicRFID:
            updateUserStatus(payloadString).then((result) => {
                if (result.isNewUser) {
                    mqtt.publish(topicAdmin + "/register/response/create", result.rfid, { qos: 1 }, null)
                } else {
                    mqtt.publish(topicAdmin, payloadString, { qos: 1 }, null)
                }
            });
            break;

        case topicRFIDApp:
            updateUserStatus(payloadString).then((result) => {
                if (result.isNewUser) {
                    mqtt.publish(topicRFIDApp + "/response", "User not registered", { qos: 1 }, null)
                    mqtt.publish(topicAdmin + "/register/response/create", result.rfid, { qos: 1 }, null)
                } else {
                    mqtt.publish(topicRFIDApp + "/response", "Updated user", { qos: 1 }, null)
                    mqtt.publish(topicAdmin, payloadString, { qos: 1 }, null)
                }
            });
            break;

        case topicAdminRegister:
            let tempUserObject = JSON.parse(payloadString);

            console.log(tempUserObject);

            registerUser(tempUserObject.rfid, tempUserObject.name).then((isSuccessful) => {
                if (isSuccessful) {
                    mqtt.publish(topicAdmin + "/register/response/successful", "Registered user", { qos: 1 }, null)
                    updateUserStatus(tempUserObject.rfid).then((result) => { console.log(result); })
                } else {
                    mqtt.publish(topicAdmin + "/register/response/failed", "Failed to register user", { qos: 1 }, null)
                }
            })

            break;

        case topicAdminDelete:
            deleteUser(payloadString).then(() => {
                mqtt.publish(topicAdmin, payloadString, { qos: 1 }, null)
            });
            break;


        default:
            console.log("default");
            break;
    }


}
