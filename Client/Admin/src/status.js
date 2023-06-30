import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

export default function Status({ user }) {
    return (
        <View style={[styles.box, user.status ? styles.green : styles.red]}>
            <Text style={styles.text}>
                {user.name} - {user.status ? "ONLINE" : "OFFLINE"}
            </Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => { user.callbackDelete() }}
            >
                <Text style={styles.text}>Delete</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    box: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        padding: 10,
        borderRadius: 10,
        backgroundColor: "#333",

        margin: 10,
    },
    text: {
        color: "#fff",
        fontSize: 20,
        lineHeight: 20,
    },
    red: {
        shadowColor: "#FF4F2A",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    green: {
        shadowColor: "#2DFF35",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    button: {
        borderRadius: 10,
        padding: 15,
        textAlign: "center",
        elevation: 2,
        marginLeft: 20,

        backgroundColor: "#555",
    },
})
