import AsyncStorage from "@react-native-async-storage/async-storage";

export const storageConfig = {
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    sync: {},
}

export const mqttOptions = {
    host: "broker.emqx.io",
    port: 8083,
    path: "/thcntt3",
    id: "id_" + parseInt(Math.random() * 100000),
};