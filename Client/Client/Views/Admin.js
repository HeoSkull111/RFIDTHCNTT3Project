import React, { useEffect, useState } from "react";
import { Text, View, Modal, StyleSheet, Pressable, TextInput } from "react-native";
import init from "react_native_mqtt";

import Status from "./status";

import { MQTT } from "../services/service";
import { mqttOptionAdmin, storageConfig, topicAdmin } from "../services/config";

init(storageConfig);

export const mqttAdmin = new MQTT(mqttOptionAdmin, topicAdmin);
const serverAPI = "http://localhost:5555/"

export const Admin = ({navigation}) => {
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
  }

  const handleOnCloseModalStatus = () => {
    setModalStatusVisible(!modalStatusVisible);
    getUsers();
  }

  return (
    <View style={styles.container}>
      <View style={styles.divHeader}>
        <Text style={styles.headerText}>Quản lý nhân viên</Text>
      </View>
      <View style={styles.divBody}>
        <View style={styles.right}>
          <Text style={styles.headingText}>Điểm Danh</Text>
          <View>
            {users.map((user, index) => {
              return (
                <Status key={index} user={user} />
              )
            })}
          </View>
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
            <Text style = {styles.text}> {newUser} </Text>
            <TextInput
              style={[styles.text, styles.modalInput]}
              placeholder="new name"
              onChangeText={setText}
              value={text}
            />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => { handleOnCloseModalNewUser(); }}>
              <Text style={styles.text}>Submit</Text>
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
        flex: 1,
        padding: 8,
        backgroundColor: '#000000',
    },
    divHeader: {
        backgroundColor: '#222222',
        padding: 24,
        margin: 8,
        borderRadius: 10,
    },
    headerText: {
        fontSize: 50,
        marginRight: 16,
        color: '#fff',
        display: 'flex',
        justifyContent: 'center',
    },
    divBody: {
      padding: 24,
      margin: 8,
      borderRadius: 10,
      flex: 1, 
      alignItems: 'center'
    },
    right: {
        width: '80%',
        marginLeft: 8,
        padding: 16,
        backgroundColor: '#222222',
        borderRadius: 10,
    },
    headingText: {
        fontSize: 30,
        color: '#fff',
        display: 'flex',
        justifyContent: 'center',
        marginBottom:10
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
    buttonClose: {
        backgroundColor: '#2196F3',
    },
});

