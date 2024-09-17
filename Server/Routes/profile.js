const express = require("express");
const {
    updateProfile,
    addCredits,
    getUserInfo,
  } = require("../Controllers/ProfileController.js");
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Profile Func
 */


/**
 * @swagger
 * /api/profile/:
 *   put:
 *     tags: [Profile]
 *     summary: Update profile
 *     requestBody:
 *       description: New user data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               profileImage:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 required: false
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Username updated successfully
 *       500:
 *         description: Error updating username
 */
router.put("/", updateProfile);

/**
 * @swagger
 * /api/profile/credits:
 *   post:
 *     tags: [Profile]
 *     summary: Add credits to user
 *     requestBody:
 *       description: Credits data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               credits:
 *                 type: number
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Credits added successfully
 *       500:
 *         description: Error adding credits
 */
router.post("/credits", addCredits);
/**
 * @swagger
 * /api/profile/:
 *   get:
 *     tags: [Profile]
 *     summary: Gets User Info
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Info retrived successfully
 *       500:
 *         description: Error retriving info
 */
router.get("/",getUserInfo);
module.exports = router;