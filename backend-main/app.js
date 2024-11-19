const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const userRoutes = require("./routes/user.routes"); // Import route user

const iotDataRouter = require("./routes/iot_data.routes.js");

const sequelize = require("./config/db.config.js");
const { initModels } = require("./models/init.model.js");

app.use(express.json()); // Parse các request có nội dung dạng JSON
app.use(express.urlencoded({ extended: true })); // Parse các request có nội dung dạng URL-encoded

// initModels()

app.use("/auth", userRoutes);

app.use("/api", iotDataRouter);

// Kết nối database và chạy server
const PORT = process.env.PORT || 3000;

sequelize
  .sync()
  .then(() => {
    console.log("Database & tables created!");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}/`);
    });
  })
  .catch((err) => console.error("Unable to connect to the database:", err));
