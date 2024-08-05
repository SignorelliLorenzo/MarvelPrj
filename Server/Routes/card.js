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
 * /api/card/copy/{id}:
 *   get:
 *     tags: [Cards]
 *     summary: Get all user cards and their duplicates
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of user cards
 *       500:
 *         description: Error fetching user cards
 */
router.get("/copy/:id", getUserCards);
/**
 * @swagger
 * /api/card/all:
 *   get:
 *     tags: [Cards]
 *     summary: Get all cards
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all cards
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