const sequelize = require("../config/db.config"); // Kết nối Sequelize
const TableInfo = require("./table_info.model"); // Import TableInfo model
const IotData = require("./iot_data.model"); // Import IotData model

const initModels = async () => {
  try {
    // Đồng bộ cơ sở dữ liệu
    await sequelize.sync({ alter: true });
    console.log("Database synced successfully.");
  } catch (err) {
    console.error("Error syncing database:", err.message);
    process.exit(1); // Dừng ứng dụng nếu lỗi nghiêm trọng
  }
};

module.exports = {
  initModels,
  // TableInfo,
  // IotData,
};
