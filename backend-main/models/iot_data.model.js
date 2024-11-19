const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config"); // Đường dẫn đến file cấu hình DB

const IotData = sequelize.define(
  "IotData",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tds: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    temperature: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pH: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    humidity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    packet_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "iot_data",
    timestamps: false,
  }
);

module.exports = IotData;
