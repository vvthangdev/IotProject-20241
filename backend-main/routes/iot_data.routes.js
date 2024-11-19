const express = require("express");
// const userMiddleware = require("../middlewares/user.middleware.js");
// const userUtil = require("../utils/user.util.js");
const iotDataController = require("../controllers/iot_data.controller.js");

const authMiddware = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.get("/all-data", iotDataController.getAllIotData);

router.use(authMiddware.authenticateToken);

router.post("/create-iotData", iotDataController.createIotData);

router.use(authMiddware.adminRoleAuth);

router.patch("/update-iotData", iotDataController.updateIotData);

router.delete("/delete-iotData", iotDataController.deleteIotData);

module.exports = router;
