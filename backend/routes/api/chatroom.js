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
    check('selectedContacts')
        .isLength({ min: 1 })
        .withMessage('Chat room must have at least one other participant.'),
    handleValidationErrors,
];

router.post(
    '/',
    requireAuth,
    validateChatRoom,
    asyncHandler(async (req, res) => {
        const { roomName, imageUrl, selectedContacts } = req.body;

        const chatRoom = await ChatRoom.create({
            name: roomName,
            adminId: req.user.id,
            imageUrl,
        });

        const contactIds = selectedContacts.map((contact) => contact.id);

        await chatRoom.addParticipants(contactIds);

        const participants = await chatRoom.getParticipants();

        let participantsInfo = participants.map((participant) => {
            return {
                id: participant.id,
                name: participant.name,
                profileUrl: participant.profileUrl,
                phoneNumber: participant.phoneNumber,
            };
        });

        const adminInfo = {
            id: req.user.id,
            name: req.user.name,
            profileUrl: req.user.profileUrl,
            phoneNumber: req.user.phoneNumber,
        };

        const allParticipants = participantsInfo.concat(adminInfo);

        return res.json({
            chatRoom,
            participants: allParticipants,
        });
    })
);

router.put(
    '/',
    requireAuth,
    asyncHandler(async (req, res) => {
        const { chatRoomId } = req.body;
        const chatRoom = await ChatRoom.findByPk(chatRoomId);
        const messages = await chatRoom.getMessages({
            order: [['createdAt', 'DESC']],
        });
        const participants = await chatRoom.getParticipants();
        const admin = await chatRoom.getAdmin();

        let participantsInfo = participants.map((participant) => {
            return {
                id: participant.id,
                name: participant.name,
                profileUrl: participant.profileUrl,
                phoneNumber: participant.phoneNumber,
            };
        });

        const adminInfo = {
            id: admin.id,
            name: admin.name,
            profileUrl: admin.profileUrl,
            phoneNumber: admin.phoneNumber,
        };

        const allParticipants = participantsInfo.concat(adminInfo);

        let messagesAndUsers = await Promise.all(
            messages.map(async (message) => {
                let user = await message.getUser();
                return {
                    ...message.dataValues,
                    author: user.name,
                    authorProfileUrl: user.profileUrl,
                };
            })
        );

        return res.json({
            chatRoom,
            messagesAndUsers,
            participants: allParticipants,
        });
    })
);

router.put(
    '/edit',
    requireAuth,
    asyncHandler(async (req, res) => {
        const { chatRoomId, roomName, description, imageUrl } = req.body;
        const chatRoom = await ChatRoom.findByPk(chatRoomId);

        if (roomName) await chatRoom.update({ name: roomName });
        if (description) await chatRoom.update({ description });
        if (imageUrl) await chatRoom.update({ imageUrl });

        const messages = await chatRoom.getMessages({
            order: [['createdAt', 'DESC']],
        });
        const participants = await chatRoom.getParticipants();
        const admin = await chatRoom.getAdmin();

        let participantsInfo = participants.map((participant) => {
            return {
                id: participant.id,
                name: participant.name,
                profileUrl: participant.profileUrl,
                phoneNumber: participant.phoneNumber,
            };
        });

        const adminInfo = {
            id: admin.id,
            name: admin.name,
            profileUrl: admin.profileUrl,
            phoneNumber: admin.phoneNumber,
        };

        const allParticipants = participantsInfo.concat(adminInfo);

        let messagesAndUsers = await Promise.all(
            messages.map(async (message) => {
                let user = await message.getUser();
                return { ...message.dataValues, author: user.name };
            })
        );

        return res.json({
            chatRoom,
            messagesAndUsers,
            participants: allParticipants,
        });
    })
);

module.exports = router;
