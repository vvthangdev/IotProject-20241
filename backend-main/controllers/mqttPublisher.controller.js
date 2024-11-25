const mqtt = require("mqtt");
require("dotenv").config(); // Đọc các biến từ tệp .env

// Đọc cấu hình từ tệp .env
const brokerUrl = process.env.BROKER_URL || "mqtt://test.mosquitto.org:1883"; // URL của MQTT broker
const topic = process.env.MQTT_TOPIC || "hunghyper/sensor/data"; // Topic để publish
const clientId =
  process.env.MQTT_CLIENT_ID ||
  "mqtt_publisher_" + Math.random().toString(16).slice(2, 10); // Tạo Client ID ngẫu nhiên nếu không được cấu hình
const publishInterval = process.env.PUBLISH_INTERVAL || 5000; // Tần suất gửi (ms)

// Kết nối tới MQTT broker
const mqttClient = mqtt.connect(brokerUrl, {
  clientId,
  clean: true, // Kết nối sạch
});

mqttClient.on("connect", () => {
  console.log("Kết nối thành công đến broker:", brokerUrl);

  // Hàm để gửi dữ liệu
  const publishData = () => {
    const payload = Math.floor(Math.random() * 10 + 20); // Giá trị nhiệt độ ngẫu nhiên (số nguyên) từ 20 - 30

    // const payload = {
    //     temperature: Math.floor(Math.random() * 10 + 20), // Giá trị nhiệt độ ngẫu nhiên (số nguyên) từ 20 - 30
    //     humidity: Math.floor(Math.random() * 10 + 20), // Giá trị độ ẩm ngẫu nhiên từ 60 - 80
    //     timestamp: new Date().toISOString().replace("T", " ").slice(0, 19), // Định dạng timestamp
    // };

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
