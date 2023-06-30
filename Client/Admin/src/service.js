export class MQTT {
    constructor(options) {
        this.topic = [
            "hntt/thcntt3/rfid/admin",
            "hntt/thcntt3/rfid/admin/register",
            "hntt/thcntt3/rfid/admin/delete",
        ];
        this.client = new Paho.MQTT.Client(options.host, options.port, options.path);
    }

    setOnMessageArrived = (callback) => {
        this.client.onMessageArrived = callback;
    }

    handleOnConnectSuccess = () => {
        console.log("Connected to MQTT broker");
        console.log("Subscribing to topic...", this.topic);
        this.subscribeTopic();
    }

    handleOnConnectFailure = () => {
        console.log("Connect failed");
        console.log("Reconnecting...");
        this.connect();
    }

    connect = () => {
        this.client.connect({
            useSSL: false,
            timeout: 5,
            onSuccess: this.handleOnConnectSuccess,
            onFailure: this.handleOnConnectFailure,
        });
    }

    subscribeTopic = () => {
        this.topic.forEach((topic) => {
            this.client.subscribe(topic, { qos: 1 });
        })
    };

    publishMessage = (topic, message) => {
        console.log(`Publishing "${message}"... on topic ${topic}`);
        const messageObject = new Paho.MQTT.Message(message);
        messageObject.destinationName = topic;
        this.client.send(messageObject);
    }
}