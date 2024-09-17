// componentsRoutes.js
const express = require("express");
const cardRoute = require("./Card");
const packetRoute = require("./Packet");
const profileRoute = require("./Profile");
const requestRoute = require("./Request");

const router = express.Router();

router.use("/card", cardRoute);
router.use("/packet", packetRoute);
router.use("/profile", profileRoute);
router.use("/request", requestRoute);

module.exports = router;