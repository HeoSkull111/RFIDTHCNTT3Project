import AsyncStorage from "@react-native-async-storage/async-storage";

export const storageConfig = {
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    sync: {},
}

export const mqttOptionAdmin = {
    host: "broker.emqx.io",
    port: 8083,
    path: "/admin",
    id: "id_" + parseInt(Math.random() * 100000),
};

export const mqttOptionCustomer = {
    host: "broker.emqx.io",
    port: 8083,
    path: "/customer",
    id: "id_" + parseInt(Math.random() * 100000),
};
export const topicAdmin = [
    "VinhH/rfid/admin",
    "VinhH/rfid/admin/register/response/create",
    "VinhH/rfid/admin/register/response/successful",
    "VinhH/rfid/admin/register/response/failed",
    "VinhH/rfid/admin/delete",
];

export const topicCustomer = [
    "VinhH/rfid/app/response",
];