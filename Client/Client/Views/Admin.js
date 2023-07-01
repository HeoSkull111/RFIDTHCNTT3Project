import React, { useEffect, useState } from "react";
import { Text, View, Modal, StyleSheet, Pressable, TextInput } from "react-native";
import init from "react_native_mqtt";

import Status from "../services/status";

import { MQTT } from "../services/service";
import { mqttOptionAdmin, storageConfig, topicAdmin } from "../services/config";

init(storageConfig);

export const mqttAdmin = new MQTT(mqttOptionAdmin, topicAdmin);
const serverAPI = "http://localhost:5555/"

export const Admin = () => {
  const [users, setUsers] = useState([]);

  const [newUser, setNewUser] = useState("");
  const [newUserStatus, setNewUserStatus] = useState(false);

  const [modalNewUserVisible, setModalNewUserVisible] = useState(false);
  const [modalStatusVisible, setModalStatusVisible] = useState(false);

  const [text, setText] = useState("");

  useEffect(() => {
    mqttAdmin.connect();
    mqttAdmin.setOnMessageArrived(onMessageArrived);

    getUsers();
  }, []);

  const onMessageArrived = async (message) => {
    const topicString = message.destinationName;
    const payloadString = message.payloadString;

    console.log("topic: ", topicString);
    console.log("payload: ", payloadString);

    if (topicString === "VinhH/rfid/admin/register/response/create") {
      setModalNewUserVisible(true);
      setNewUser(payloadString);
      return;
    }

    if (topicString === "VinhH/rfid/admin/register/response/successful") {
      setModalNewUserVisible(false);
      setNewUserStatus(true);
      setModalStatusVisible(true);
      return;
    }

    if (topicString === "VinhH/rfid/admin/register/response/failed") {
      setModalNewUserVisible(false);
      setNewUserStatus(false);
      setModalStatusVisible(true);
      return;
    }

    getUsers();
  }

  const getUsers = async () => {
    const response = await fetch(serverAPI + "users/");
    const tempUsers = await response.json();
    setUsers(tempUsers.map((user) => {
      user.callbackDelete = () => {
        mqttAdmin.publishMessage("VinhH/rfid/admin/delete", user.rfid);
      }
      return user;
    }));
  }

  const handleOnCloseModalNewUser = () => {
    setModalNewUserVisible(!modalNewUserVisible);

    if (text === '') return;
    mqttAdmin.publishMessage("VinhH/rfid/admin/register", `{ "name": "${text}", "rfid": "${newUser}" }`);
    // const targetDoc = doc(firebaseDB, 'users', rfid);
    // setDoc(targetDoc, { name: text, rfid, status: false }).then(() => { setText(''); });
  }

  const handleOnCloseModalStatus = () => {
    setModalStatusVisible(!modalStatusVisible);
    getUsers();
  }

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>
          Current User Status
        </Text>
        <View>
          {users.map((user, index) => {
            return (
              <Status key={index} user={user} />
            )
          })}
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalNewUserVisible}
        onRequestClose={() => { handleOnCloseModalNewUser(); }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalWrapper}>
            <Text style={styles.modalTitle}>Create New User</Text>
            <Text> {newUser} </Text>
            <TextInput
              style={[styles.text, styles.modalInput]}
              placeholder="new name"
              onChangeText={setText}
              value={text}
            />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => { handleOnCloseModalNewUser(); }}>
              <Text style={styles.text}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalStatusVisible}
        onRequestClose={() => { handleOnCloseModalStatus(); }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalWrapper}>
            <Text style={styles.modalTitle}>{
              newUserStatus ? "Create New User Successful" : "Create New User Failed"
            }</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => { handleOnCloseModalStatus(); }}>
              <Text style={styles.text}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#111",
  },
  wrapper: {
    padding: 40,
    backgroundColor: "#222",
    borderRadius: 10,
    shadowColor: "#FFF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    textAlign: "center",
  },
  modalContainer: {
    width: "100%",
    height: "100%",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#111",
    color: "#fff",
  },
  modalWrapper: {
    padding: 40,
    backgroundColor: "#222",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  modalInput: {
    width: "100%",
    height: 40,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: "#fff",
    color: "#000",
  },
  text: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 20,
    color: "#fff",
  },
  button: {
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 5,
    textAlign: "center",
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
});

