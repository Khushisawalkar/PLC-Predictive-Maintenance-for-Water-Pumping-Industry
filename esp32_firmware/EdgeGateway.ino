#include <ModbusMaster.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// --- Configuration ---
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";
const char* mqtt_server = "YOUR_MQTT_BROKER_IP";

// Modbus RTU pins for RS485 MAX485 module
#define MAX485_RE_NEG  4
#define MAX485_DE      4
#define RX_PIN         16
#define TX_PIN         17

// --- Objects ---
WiFiClient espClient;
PubSubClient client(espClient);
ModbusMaster node;

// --- Setup ---
void setup() {
  Serial.begin(115200);
  
  // Setup RS485 control pins
  pinMode(MAX485_RE_NEG, OUTPUT);
  pinMode(MAX485_DE, OUTPUT);
  digitalWrite(MAX485_RE_NEG, 0); // Receiver Enable
  digitalWrite(MAX485_DE, 0);     // Driver Disable

  // Setup Modbus communication
  Serial2.begin(9600, SERIAL_8N1, RX_PIN, TX_PIN);
  node.begin(1, Serial2); // PLC Modbus ID = 1
  
  // node.preTransmission(preTransmission);
  // node.postTransmission(postTransmission);

  setup_wifi();
  client.setServer(mqtt_server, 1883);
}

void setup_wifi() {
  delay(10);
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi connected");
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP32_EdgeGateway")) {
      Serial.println("connected");
      // Subscribe to control topics here if needed (e.g. manual override)
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

// --- Main Loop ---
void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Read Holding Registers from PLC (Example: Address 40001, Length 10)
  uint8_t result = node.readHoldingRegisters(0x0000, 10);
  
  if (result == node.ku8MBSuccess) {
    // 1. Read Data
    float temperature = node.getResponseBuffer(0) / 10.0;
    float vibration = node.getResponseBuffer(1) / 100.0;
    float current = node.getResponseBuffer(2) / 10.0;
    float voltage = node.getResponseBuffer(3);
    float pressure = node.getResponseBuffer(4) / 10.0;
    
    // 2. Preprocess / Format JSON Payload
    StaticJsonDocument<256> doc;
    doc["temperature"] = temperature;
    doc["vibration"] = vibration;
    doc["current"] = current;
    doc["voltage"] = voltage;
    doc["pressure"] = pressure;
    doc["timestamp"] = millis(); // or NTP time

    char jsonBuffer[256];
    serializeJson(doc, jsonBuffer);

    // 3. Publish over MQTT
    client.publish("factory/pump1/telemetry", jsonBuffer);
    
    Serial.println(jsonBuffer);
  } else {
    Serial.println("Modbus Read Failed!");
  }
  
  delay(2000); // Polling interval
}
