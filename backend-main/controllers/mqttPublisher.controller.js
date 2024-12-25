const mqtt = require("mqtt");
require("dotenv").config(); // Đọc các biến từ tệp .env

// Đọc cấu hình từ tệp .env
const brokerUrl = process.env.BROKER_URL || "mqtt://test.mosquitto.org:1883"; // URL của MQTT broker
const topic = process.env.MQTT_TOPIC || "hunghyper/sensor/data"; // Topic để publish
const clientId =
  process.env.MQTT_CLIENT_ID ||
  "mqtt_publisher_" + Math.random().toString(16).slice(2, 10); // Tạo Client ID ngẫu nhiên nếu không được cấu hình
const publishInterval = process.env.PUBLISH_INTERVAL || 5000; // Tần suất gửi (ms)
const mqttUserName = process.env.MQTT_USERNAME
const mqttPassword = process.env.MQTT_PASSWORD
// Kết nối tới MQTT broker
const mqttClient = mqtt.connect(brokerUrl, {
  clientId,
  username: mqttUserName,
  password: mqttPassword,
  clean: true, // Kết nối sạch
});

mqttClient.on("connect", () => {
  console.log("Kết nối thành công đến broker:", brokerUrl);

  // Hàm để gửi dữ liệu
  const publishData = () => {
    const payload = Math.floor(Math.random() * 10 + 20); // Giá trị nhiệt độ ngẫu nhiên (số nguyên) từ 20 - 30

    mqttClient.publish(topic, JSON.stringify(payload), { qos: 0 }, (err) => {
      if (!err) {
        console.log(`Đã gửi dữ liệu đến topic "${topic}":`, payload);
      } else {
        console.error("Lỗi khi gửi dữ liệu:", err);
      }
    });
  };

  // Gửi dữ liệu định kỳ theo khoảng thời gian từ .env
  setInterval(publishData, parseInt(publishInterval, 10));
});

// Xử lý lỗi kết nối
mqttClient.on("error", (err) => {
  console.error("Lỗi kết nối MQTT:", err);
});
