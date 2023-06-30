#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <SPI.h>
#include <MFRC522.h>

#define ssid "Nguyen MInh"
#define password "268268268"

// MQTT Broker Information
#define mqtt_domain "broker.emqx.io"
#define mqtt_port 1883
#define mqtt_topic_pub "VinhH/rfid"

// RFID
#define SS_PIN D8
#define RST_PIN D3
MFRC522 mfrc522(SS_PIN, RST_PIN);

// LED
// #define CanRead D0
// #define WaitingLED D1
// #define SuccessfulLED D2

WiFiClient espClient;
PubSubClient client(espClient);

// void initializePinMode() {
//   Serial.println("\nInitialize PinMode");

//   pinMode(CanRead, INPUT);
//   pinMode(WaitingLED, OUTPUT);
//   pinMode(SuccessfulLED, OUTPUT);

//   Serial.println("Done");
// }

void initializeWIFI() {
  Serial.println("\nInitialize Wifi");

  Serial.printf("\nConnecting to %s\n", ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.print("\nWiFi connected. IP address: ");
  Serial.println(WiFi.localIP());
  Serial.println("Done");
}

void initializeRFID() {
  Serial.println("\nInitialize RFID");

  SPI.begin();
  mfrc522.PCD_Init();

  Serial.println("Done");
}

void setup() {
  Serial.println("Starting NodeMCU ESP8266.");
  Serial.begin(115200);

  // initialize
  // initializePinMode();
  initializeWIFI();
  initializeRFID();

  client.setServer(mqtt_domain, mqtt_port);
  client.setCallback(receiveMessage);

  reconnect();
}

String convertPayload(byte *payload, unsigned int length) {
  String result = "";
  for (int i = 0; i < length; i++) {
    result += (char)payload[i];
  }
  return result;
}

void receiveMessage(char *topic, byte *payload, unsigned int length) {
  String message = convertPayload(payload, length);

  Serial.printf("\nTopic: %s\n", topic);
  Serial.printf("\nMessage: %s\n", message);
}

void reconnect() {
  // lặp cho đến khi được kết nối trở lại
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("mqttx_954e093c")) {
      Serial.println("Connected");
      client.publish(mqtt_topic_pub, "Connected from NodeMCU ESP8266");
      client.subscribe(mqtt_topic_pub);
    } else {
      int state = client.state();
      Serial.printf("\nFailed, rc=%d try again in 5 seconds\n", state);
      delay(5000);
    }
  }
}

String readRFID() {
  if (!mfrc522.PICC_IsNewCardPresent())
    return "";

  if (!mfrc522.PICC_ReadCardSerial())
    return "";

  String data = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    data.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " "));
    data.concat(String(mfrc522.uid.uidByte[i], HEX));
  }

  data.trim();
  data.toUpperCase();

  return data;
}

unsigned long lastMessageTime = -1000;

void processRFID() {
  if (millis() - lastMessageTime > 1000) {
    String RFIDData = readRFID();

    // digitalWrite(SuccessfulLED, LOW);
    // digitalWrite(WaitingLED, HIGH);

    if (!(RFIDData == "")) {
      const char *msg = RFIDData.c_str();
      Serial.println(msg);
      client.publish(mqtt_topic_pub, msg);

      lastMessageTime = millis();
      // digitalWrite(SuccessfulLED, HIGH);
      // digitalWrite(WaitingLED, LOW);
    }
  }
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  processRFID();
  // if (digitalRead(CanRead)) {
  //   processRFID();
  // }

  client.loop();
}