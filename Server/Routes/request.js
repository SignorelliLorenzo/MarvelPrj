const express = require("express");
const {
    addRequest,
    acceptRequest,
    getRequestById,
    getAllRequests,
    getRequestsByCard,
    deleteRequest,
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
 * /api/request/delete/{id}:
 *   delete:
 *     tags: [Request]
 *     summary: Delete a request by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Request ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Request deleted successfully
 *       404:
 *         description: Request not found
 *       500:
 *         description: Error deleting request
 */
router.delete("/delete/:requestId", deleteRequest); 
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
router.get("/card/:id", getRequestsByCard);

/**
 * @swagger
 * /api/request/get/{id}:
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
router.get("/get/:id", getRequestById);

/**
 * @swagger
 * /api/request/all:
 *   get:
 *     tags: [Request]
 *     summary: Get all requests
 *     description: Fetch all requests with optional filters for card name, limit, and accepted status.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Limit the number of requests returned
 *       - in: query
 *         name: cardName
 *         schema:
 *           type: string
 *           example: "Dragon"
 *         description: Filter requests by the name of the requested card (case-insensitive)
 *       - in: query
 *         name: notAccepted
 *         schema:
 *           type: boolean
 *           example: true
 *         description: Filter requests to only include those that have not been accepted (true or false)
 *     responses:
 *       200:
 *         description: A list of requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The request ID
 *                   ownerRequest:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                         description: The username of the owner of the request
 *                   tradedCards:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         cardId:
 *                           type: string
 *                           description: The card ID of the traded card
 *                   requestedCards:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           description: The card ID of the requested card
 *                   accepted:
 *                     type: boolean
 *                     description: Whether the request has been accepted or not
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Error fetching requests
 */
router.get("/all", getAllRequests);

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
router.post("/accept/:tradeId", acceptRequest);

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
 *               credits:
 *                 type: number
 *                 required: false
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Request added successfully
 *       500:
 *         description: Error adding request
 */
router.post("/add", addRequest);
module.exports = router;