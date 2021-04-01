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

        // const users = await Promise.all(
        //     messages.map(async (message) => message.getUser())
        // );

        let messagesAndUsers = await Promise.all(
            messages.map(async (message) => {
                let user = await message.getUser();
                return { ...message.dataValues, author: user.name };
            })
        );

        return res.json({ chatRoom, messagesAndUsers });
    })
);

module.exports = router;
