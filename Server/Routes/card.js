const express = require("express");
const {
  addCard,
  deleteCard,
  getAllCards,
  getUserCards,
  getCardById,
} = require("../Controllers/CardsController.js");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: Cards Func
 */
/**
 * @swagger
 * /api/card/copy:
 *   get:
 *     tags: [Cards]
 *     summary: Get all user cards and their duplicates
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of user cards
 *       500:
 *         description: Error fetching user cards
 */
router.get("/copy", getUserCards);
/**
 * @swagger
 * /api/card/all:
 *   get:
 *     tags: [Cards]
 *     summary: Get all cards with optional filters
 *     description: Fetches all cards, with optional filters for card name and result limit.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cardName
 *         schema:
 *           type: string
 *         description: Filter cards that start with the specified card name
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Limit the number of cards returned
 *     responses:
 *       200:
 *         description: A list of cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card' # Adjust if using a schema for cards
 *       500:
 *         description: Error fetching cards
 */
router.get("/all", getAllCards);

/**
 * @swagger
 * /api/card/{id}:
 *   get:
 *     tags: [Cards]
 *     summary: Get card by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Card ID
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Card details
 *       500:
 *         description: Error fetching card
 */
router.get("/:id", getCardById);
module.exports = router;