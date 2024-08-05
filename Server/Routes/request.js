const express = require("express");
const {
    addRequest,
    acceptRequest,
    getRequestById,
    getAllRequests,
    getRequestsByCard,
  } = require("../Controllers/RequestController.js");
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Request
 *   description: Request Func
 */

/**
 * @swagger
 * /api/request/card/{id}:
 *   get:
 *     tags: [Request]
 *     summary: Get request by card ID
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
 *         description: A list of requests
 *       500:
 *         description: Error fetching requests by card ID
 */
router.get("/request/card/:id", getRequestsByCard);

/**
 * @swagger
 * /api/request/{id}:
 *   get:
 *     tags: [Request]
 *     summary: Get request by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Request ID
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Request details
 *       500:
 *         description: Error fetching request
 */
router.get("/request/:id", getRequestById);

/**
 * @swagger
 * /api/request/all:
 *   get:
 *     tags: [Request]
 *     summary: Get all requests
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of requests
 *       500:
 *         description: Error fetching requests
 */
router.get("/request/all", getAllRequests);

/**
 * @swagger
 * /api/request/accept:
 *   post:
 *     tags: [Request]
 *     summary: Accept a request
 *     requestBody:
 *       description: Request data to accept
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestId:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Request accepted successfully
 *       500:
 *         description: Error accepting request
 */
router.post("/request/accept", acceptRequest);

/**
 * @swagger
 * /api/request/add:
 *   post:
 *     tags: [Request]
 *     summary: Add a new request
 *     requestBody:
 *       description: Request data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               giveCards:
 *                 type: array
 *                 items:
 *                   type: string
 *               requestCards:
 *                 type: array
 *                 items:
 *                   type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Request added successfully
 *       500:
 *         description: Error adding request
 */
router.post("/request/add", addRequest);
module.exports = router;