import { database } from "../server.js";
import { v4 as uuidv4 } from 'uuid';

//register user here
// const registeredUsers = {
//     "04 D8 C1 2B": "Nguyen Teo Van",
//     "A7 A4 90 5F": "Tran Van Bao",
// }

export const getUser = async (rfid) => {
    const reference = database.collection("users").doc(rfid);
    const snapshot = await reference.get();
    const data = snapshot.data();

    if (data === undefined) {
        return null;
    } else {
        return data;
    }
}

export const getUsers = async () => {
    const reference = database.collection("users");
    const snapshot = await reference.get();
    const data = snapshot.docs.map(doc => doc.data());
    return data;
}

const getListUsers = async () => {
    const reference = database.collection("listUsers");
    const snapshot = await reference.get();
    const data = snapshot.docs.map(doc => doc.data());
    return data;
}

export const registerUser = async (rfid, name) => {
    const reference = database.collection("listUsers");

    let isSuccessful = false;

    await reference.doc(rfid).set({
        rfid: rfid,
        name: name,
        id: uuidv4(),
        status: false
    }).then(() => {
        isSuccessful = true;
        console.log("registered user");
    });

    return isSuccessful;
}

export const updateUserStatus = async (rfid) => {
    const reference = database.collection("users").doc(rfid);
    let isNewUser = false;

    let listUsers = await getListUsers();

    await reference.get().then((snapshot) => {
        const data = snapshot.data();

        if (data === undefined) {
            let tempUser = listUsers.find(user => user.rfid === rfid);

            if (tempUser === undefined) {
                isNewUser = true;
            } else {
                reference.set({
                    rfid: tempUser.rfid,
                    name: tempUser.name,
                    id: tempUser.id,
                    status: !tempUser.status
                });
                console.log("updated user status");
            }
        } else {
            reference.update({ status: !data.status });
            console.log("updated user status");
        }
    });

    return { rfid, isNewUser }
}

export const deleteUser = async (rfid) => {
    const reference = database.collection("users").doc(rfid);
    const referenceList = database.collection("listUsers").doc(rfid);

    const snapshot = await reference.get();
    const snapshotList = await referenceList.get();

    const data = snapshot.data();
    const dataList = snapshotList.data();

    if (data !== undefined) {
        await reference.delete();
    }

    if (dataList !== undefined) {
        await referenceList.delete();
    }
}