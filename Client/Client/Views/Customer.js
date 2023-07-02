import React, { useState, useEffect } from "react";
import { Text, View, Modal, StyleSheet, Pressable, TextInput, Button } from "react-native";

import init from "react_native_mqtt";

import { MQTT } from "../services/service";
import { mqttOptionCustomer, storageConfig, topicCustomer } from "../services/config";

init(storageConfig);

export const mqttCustmomer = new MQTT(mqttOptionCustomer, topicCustomer);

export const Customer = () => {
  const [text, setText] = useState('');
  const [res, setRes] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    mqttCustmomer.connect();
    mqttCustmomer.setOnMessageArrived(onMessageArrived);
  }, []);

  const onMessageArrived = async (m) => {
    const message = m.payloadString;
    console.log(`Message arrived: ${message}`);

    setRes(message);
    setModalVisible(true);
  }

  const handleSubmit = () => {
    mqttCustmomer.publishMessage("VinhH/rfid/app", text);
  }

  const handleOnCloseModal = () => {
    setModalVisible(!modalVisible);
  }

  return (
    <View style={styles.container}>
      <View style={styles.divHeader}>
        <Text style={styles.headerText}>Điểm danh cá nhân</Text>
      </View>
      <View style={styles.divBody}>
        <View style={styles.wrapper}>
          <TextInput
            style={[styles.text, styles.modalInput]}
            placeholder="Nhập mã RFID của bạn"
            onChangeText={setText}
            value={text}
          />
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => { handleSubmit(); }}>
            <Text style={styles.text}>Submit</Text>
          </Pressable>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => { handleOnCloseModal(); }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalWrapper}>
            <Text style={styles.modalTitle}>{res}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => { handleOnCloseModal(); }}>
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
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  divHeader: {
    width: '99.15%',
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
});

