const mqtt = require("mqtt");
const IotData = require("../models/iot_data.model"); // Import model
require("dotenv").config(); // Load các biến môi trường từ tệp .env

// Sử dụng biến môi trường
const brokerUrl = process.env.BROKER_URL || "mqtt://broker.hivemq.com"; // URL của MQTT broker
const topic = process.env.MQTT_TOPIC || "iot/sensor-data"; // Topic cần subscribe
const mqttOptions = {
  clientId:
    process.env.MQTT_CLIENT_ID ||
    "mqtt_client_" + Math.random().toString(16).substr(2, 8),
  username: process.env.MQTT_USERNAME || undefined, // Nếu broker yêu cầu xác thực
  password: process.env.MQTT_PASSWORD || undefined, // Nếu broker yêu cầu xác thực
  clean: true,
};

// Kết nối MQTT broker
const mqttClient = mqtt.connect(brokerUrl, mqttOptions);

mqttClient.on("connect", () => {
  console.log("MQTT connected to broker:", brokerUrl);
  mqttClient.subscribe(topic, (err) => {
    if (!err) {
      console.log(`Subscribed to topic: ${topic}`);
    } else {
      console.error("Error subscribing to topic:", err);
    }
  });
});

mqttClient.on("message", async (topic, message) => {
  try {
    // Parse message JSON (giả sử dữ liệu MQTT gửi là JSON)
    const { tds, temperature, pH, humidity, packet_no } = JSON.parse(message);

    // Lưu dữ liệu vào database
    await IotData.create({
      tds,
      temperature,
      pH,
      humidity,
      packet_no,
    });

    console.log("Data saved to database:", {
      tds,
      temperature,
      pH,
      humidity,
      packet_no,
    });
  } catch (error) {
    console.error("Error processing MQTT message:", error);
  }
});

mqttClient.on("error", (err) => {
  console.error("MQTT error:", err);
});

module.exports = mqttClient;
