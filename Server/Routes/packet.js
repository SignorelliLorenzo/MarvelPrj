const express = require("express");
const {
    createPacket,
    getAllPackets,
    openPacket,
    buyPacket,
  } = require("../Controllers/PacketController.js");
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Packet
 *   description: Packet Func
 */
/**
 * @swagger
 * /api/packet/open/{id}:
 *   get:
 *     tags: [Packet]
 *     summary: Open a packet by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Packet ID
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Packet opened successfully
 *       500:
 *         description: Error opening packet
 */
router.get("/packet/open/:id", openPacket);



/**
 * @swagger
 * /api/packet/buy:
 *   post:
 *     tags: [Packet]
 *     summary: Buy a packet
 *     requestBody:
 *       description: Packet purchase data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               packetId:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Packet purchased successfully
 *       500:
 *         description: Error buying packet
 */
router.post("/packet/buy", buyPacket);

/**
 * @swagger
 * /api/packet/all:
 *   get:
 *     tags: [Packet]
 *     summary: Get all packets
 *     responses:
 *       200:
 *         description: A list of all packets
 *       500:
 *         description: Error fetching packets
 */
router.get("/packet/all", getAllPackets); 
module.exports = router;