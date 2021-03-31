const express = require('express');
const { ChatRoom } = require('../../db/models');
const { check } = require('express-validator');
const asyncHandler = require('express-async-handler');
const { singleMulterUpload, singlePublicFileUpload } = require('../../awsS3');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateChatRoom = [
    check('roomName')
        .exists({ checkFalsy: true })
        .withMessage('Chat room name cannot be empty.')
        .isLength({ max: 50 })
        .withMessage('Chat room name cannot exceed 50 characters.'),
    handleValidationErrors,
];

router.post(
    '/',
    validateChatRoom,
    asyncHandler(async (req, res) => {
        const { roomName, adminId, imageUrl } = req.body;

        const chatroom = await ChatRoom.create({
            name: roomName,
            adminId,
            imageUrl,
        });

        return res.json({ chatroom });
    })
);

module.exports = router;
