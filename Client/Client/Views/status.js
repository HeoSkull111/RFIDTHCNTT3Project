import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

export default function Status({ user }) {
    return (
        <View style={[styles.box, user.status ? styles.green : styles.red]}>
            <View style={styles.memberListRow}>
                <View style={styles.memberListCell}>
                    <Text style= {styles.text}>{user.name}</Text>
                </View>
                <View style={styles.memberListCell}>
                    <Text style = {styles.text}>{user.status ? "🟢 - Online" : "🔴 - Offline"}</Text>
                </View>
                <View style={styles.memberListCell}>
                    <Text style = {styles.text}></Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => { user.callbackDelete() }}
                    >
                        <Text style={styles.text}>Delete</Text>
                      </TouchableOpacity>
                </View>
            </View>
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
        shadowRadius: 25,
    },
    green: {
        shadowColor: "#2DFF35",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.5,
        shadowRadius: 25,
    },
    button: {
        borderRadius: 10,
        padding: 15,
        textAlign: "center",
        elevation: 2,
        marginLeft: 20,

        backgroundColor: "#b22510",
    },
    memberListRow: {
        flex: 1,
        flexDirection: 'row',
        borderLeftWidth: 1,
        borderLeftColor: '#2f2f2f',
    },
    memberListCell: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 48,
        borderBottomWidth: 1,
        borderBottomColor: '#2f2f2f',
        borderRightWidth: 1,
        borderRightColor: '#2f2f2f',
    },
})
