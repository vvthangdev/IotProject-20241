const mqtt = require("mqtt");
const express = require("express");
require("dotenv").config(); // Đọc các biến từ tệp .env

const app = express();
app.use(express.json());

// Đọc cấu hình từ tệp .env
const brokerUrl = process.env.BROKER_URL || "mqtt://broker.hivemq.com:1883"; // URL của MQTT broker
const topic = "hunghyper/AC/on_off"; // Topic để publish
const clientId =
  process.env.MQTT_CLIENT_ID ||
  "mqtt_publisher_" + Math.random().toString(16).slice(2, 10); // Tạo Client ID ngẫu nhiên nếu không được cấu hình
const mqttUserName = process.env.MQTT_USERNAME;
const mqttPassword = process.env.MQTT_PASSWORD;

// Kết nối tới MQTT broker
const mqttClient = mqtt.connect(brokerUrl, {
  clientId,
  username: mqttUserName,
  password: mqttPassword,
  clean: true, // Kết nối sạch
});

// API POST để gửi dữ liệu 0 hoặc 1 qua MQTT
const mqttControl = (req, res) => {
  const { value } = req.body;

  // Validate input
  if (value !== 0 && value !== 1) {
    return res.status(400).json({
      success: false,
      message: "Giá trị không hợp lệ. Chỉ chấp nhận 0 hoặc 1",
    });
  }

  try {
    // Publish to MQTT
    mqttClient.publish(topic, JSON.stringify(value), { qos: 0 }, (err) => {
      if (err) {
        console.error("Lỗi khi gửi dữ liệu:", err);
        return res.status(500).json({
          success: false,
          message: "Lỗi khi gửi dữ liệu đến MQTT broker",
        });
      }

      console.log(`Đã gửi dữ liệu đến topic ${topic}: ${value}`);
      res.json({
        success: true,
        message: "Đã gửi dữ liệu thành công",
        data: { value, topic },
      });
    });
  } catch (error) {
    console.error("Lỗi:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};

app.post("/api/control", mqttControl);

mqttClient.on("connect", () => {
  console.log("Kết nối thành công đến broker:", brokerUrl);
});

// Xử lý lỗi kết nối
mqttClient.on("error", (err) => {
  console.error("Lỗi kết nối MQTT:", err);
});

module.exports = {
  mqttControl,
};
