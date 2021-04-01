const express = require('express');
const { ChatRoom } = require('../../db/models');
const { check } = require('express-validator');
const asyncHandler = require('express-async-handler');
const { singleMulterUpload, singlePublicFileUpload } = require('../../awsS3');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

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
    requireAuth,
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

router.put(
    '/',
    requireAuth,
    asyncHandler(async (req, res) => {
        const { chatRoomId } = req.body;
        const chatRoom = await ChatRoom.findByPk(chatRoomId);
        const messages = await chatRoom.getMessages();
        return res.json({ chatRoom, messages });
    })
);

module.exports = router;
