// componentsRoutes.js
const express = require("express");
const cardRoute = require("./card");
const packetRoute = require("./packet");
const profileRoute = require("./profile");
const requestRoute = require("./request");

const router = express.Router();

router.use("/card", cardRoute);
router.use("/packet", packetRoute);
router.use("/profile", profileRoute);
router.use("/request", requestRoute);

module.exports = router;