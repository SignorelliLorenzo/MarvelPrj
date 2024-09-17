const express = require("express");
const {
    createPacket,
    getAllUnopenedPackets,
    getAllPackets,
    openPacket,
    buyPacket,
    getPacketById,
    deletePacket
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
router.get("/open/:packetId", openPacket);



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
router.post("/buy", buyPacket);

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
router.get("/all", getAllPackets); 

/**
 * @swagger
 * /api/packet/unopened:
 *   get:
 *     tags: [Packet]
 *     summary: Get all unopened packets for the current user
 *     responses:
 *       200:
 *         description: A list of unopened packets
 *       500:
 *         description: Error fetching unopened packets
 */
router.get("/unopened", getAllUnopenedPackets);
/**
 * @swagger
 * /api/packet/getById/{id}:
 *   get:
 *     tags: [Packet]
 *     summary: Get packet by id
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
 *         description: The packet
 *       500:
 *         description: Error fetching packet
 */
router.get("/getById/:id", getPacketById); 

/**
 * @swagger
 * /api/packet/add:
 *   post:
 *     tags:
 *       - Packet
 *     summary: Create a new packet
 *     description: Create a new packet with details like name, price, image, and number of cards.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - img
 *               - cards
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the packet
 *                 example: "Ultimate Marvel Packet"
 *               price:
 *                 type: number
 *                 description: Price of the packet in credits
 *                 example: 99.99
 *               img:
 *                 type: string
 *                 description: Image URL for the packet
 *                 example: "https://example.com/image.png"
 *               cards:
 *                 type: number
 *                 description: Number of cards in the packet
 *                 example: 100
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Packet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Packet'  # Assuming Packet is defined in components
 *       400:
 *         description: Bad request (e.g., missing fields or invalid data)
 *       401:
 *         description: Unauthorized, invalid or missing bearer token
 *       500:
 *         description: Server error, unable to create packet
 */
router.post("/add", createPacket); 
/**
 * @swagger
 * /api/packet/delete{id}:
 *   delete:
 *     tags:
 *       - Packet
 *     summary: Delete a packet
 *     description: Deletes a packet by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the packet to delete
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Packet deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Packet deleted successfully"
 *       404:
 *         description: Packet not found
 *       401:
 *         description: Unauthorized, invalid or missing bearer token
 *       500:
 *         description: Server error, unable to delete packet
 */
router.delete("/delete/:id", deletePacket); 

module.exports = router;