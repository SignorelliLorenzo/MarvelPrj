const express = require("express");
const {
    updateUserProfileImage,
    updateUsername,
    addCredits,
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
 * /api/profile/image:
 *   put:
 *     tags: [Profile]
 *     summary: Update user profile image
 *     requestBody:
 *       description: New profile image data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageUrl:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile image updated successfully
 *       500:
 *         description: Error updating profile image
 */
router.put("/profile/image", updateUserProfileImage);

/**
 * @swagger
 * /api/profile/username:
 *   put:
 *     tags: [Profile]
 *     summary: Update username
 *     requestBody:
 *       description: New username data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Username updated successfully
 *       500:
 *         description: Error updating username
 */
router.put("/profile/username", updateUsername);

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
router.post("/profile/credits", addCredits);
module.exports = router;