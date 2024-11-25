// Import các thư viện và module cần thiết
const mqtt = require("mqtt"); // Thư viện MQTT
const IotData = require("../models/iot_data.model"); // Import model để lưu dữ liệu vào cơ sở dữ liệu
require("dotenv").config(); // Tải các biến môi trường từ tệp .env

// Sử dụng biến môi trường để cấu hình
const brokerUrl = process.env.BROKER_URL || "mqtt://broker.hivemq.com"; // URL của MQTT broker (sử dụng mặc định là HiveMQ nếu không cấu hình)
const topic = process.env.MQTT_TOPIC || "iot/sensor-data"; // Tên topic cần subscribe (mặc định là "iot/sensor-data")
const mqttOptions = {
  clientId:
    process.env.MQTT_CLIENT_ID ||
    "mqtt_client_" + Math.random().toString(16).substring(2, 10), // Tạo client ID ngẫu nhiên nếu không được cấu hình
  username: process.env.MQTT_USERNAME || undefined, // Username nếu broker yêu cầu xác thực
  password: process.env.MQTT_PASSWORD || undefined, // Password nếu broker yêu cầu xác thực
  clean: true, // Tùy chọn kết nối sạch (clean session)
};

// Kết nối đến MQTT broker
const mqttClient = mqtt.connect(brokerUrl, mqttOptions);

// Sự kiện khi kết nối thành công
mqttClient.on("connect", () => {
  console.log("Kết nối MQTT thành công tới broker:", brokerUrl);

  // Đăng ký (subscribe) vào topic
  mqttClient.subscribe(topic, (err) => {
    if (!err) {
      console.log(`Đã subscribe vào topic: ${topic}`);
    } else {
      console.error("Lỗi khi subscribe vào topic:", err);
    }
  });
});

// Sự kiện khi nhận được tin nhắn từ broker
// mqttClient.on("message", async (topic, message) => {
//   try {
//     // Giả sử dữ liệu nhận được là JSON, cần parse
//     const { tds, temperature, pH, humidity, packet_no } = JSON.parse(message);

//     // Lưu dữ liệu nhận được vào cơ sở dữ liệu
//     await IotData.create({
//       tds,
//       temperature,
//       pH,
//       humidity,
//       packet_no,
//     });

//     console.log("Dữ liệu đã được lưu vào cơ sở dữ liệu:", {
//       tds,
//       temperature,
//       pH,
//       humidity,
//       packet_no,
//     });
//   } catch (error) {
//     console.error("Lỗi khi xử lý tin nhắn MQTT:", error);
//   }
// });

// Hàm thêm padding để chuẩn hóa timestamp
const padTimestamp = (timestamp) => {
  return timestamp.replace(
    /(\d{4}-\d{2}-\d{2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/,
    (_, date, hour, minute, second) => {
      // Thêm số 0 nếu thiếu
      const paddedHour = hour.padStart(2, "0");
      const paddedMinute = minute.padStart(2, "0");
      const paddedSecond = second.padStart(2, "0");
      return `${date} ${paddedHour}:${paddedMinute}:${paddedSecond}`;
    }
  );
};

mqttClient.on("message", async (topic, message) => {
  try {
    // Parse dữ liệu nhận từ MQTT
    const data = JSON.parse(message);
    let { temperature, humidity, timestamp } = data;

    console.log("Dữ liệu MQTT nhận được:", data);

    // Kiểm tra và chuẩn hóa timestamp
    if (timestamp) {
      timestamp = padTimestamp(timestamp); // Chuẩn hóa timestamp
    } else {
      throw new Error("Timestamp bị thiếu hoặc null");
    }

    // Chuyển timestamp sang đối tượng Date
    const parsedTimestamp = new Date(timestamp);

    // Kiểm tra nếu timestamp không hợp lệ
    if (isNaN(parsedTimestamp)) {
      throw new Error("Không thể chuyển đổi timestamp thành ngày giờ");
    }

    // Lưu dữ liệu vào cơ sở dữ liệu
    const newData = await IotData.create({
      temperature,
      humidity,
      timestamp: parsedTimestamp,
    });

    console.log("Dữ liệu đã được lưu thành công:", newData.toJSON());
  } catch (error) {
    console.error("Lỗi khi xử lý tin nhắn MQTT:", error.message);
  }
});

// Sự kiện khi xảy ra lỗi kết nối hoặc lỗi hệ thống
mqttClient.on("error", (err) => {
  console.error("Lỗi MQTT:", err);
});

// Xuất module MQTT client để sử dụng ở các nơi khác trong dự án
module.exports = mqttClient;
