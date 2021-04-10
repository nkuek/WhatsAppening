const express = require('express');
const asyncHandler = require('express-async-handler');
const db = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { Op } = require('sequelize');

const router = express.Router();

router.put(
    '/',
    requireAuth,
    asyncHandler(async (req, res) => {
        const { searchQuery } = req.body;
        const user = await db.User.findByPk(req.user.id);

        const matchedContacts = await user.getUserContacts({
            where: {
                [Op.or]: {
                    name: {
                        [Op.iLike]: `%${searchQuery}%`,
                    },
                    phoneNumber: {
                        [Op.iLike]: `%${searchQuery}%`,
                    },
                },
            },
        });

        const adminRooms = await user.getAdmin({
            where: {
                name: {
                    [Op.iLike]: `%${searchQuery}%`,
                },
            },
        });

        const participantRooms = await user.getParticipants({
            where: {
                name: {
                    [Op.iLike]: `%${searchQuery}%`,
                },
            },
        });

        const matchedRooms = [...adminRooms, ...participantRooms];

        const matchedRoomsAndMessages = await Promise.all(
            matchedRooms.map(async (room) => {
                const messages = await room.getMessages();
                let lastMessage = [];
                if (messages.length > 0) {
                    lastMessage = messages[messages.length - 1];
                    const lastMessageAuthor = await lastMessage.getUser();
                    lastMessage.dataValues.author = lastMessageAuthor.name;
                }
                return {
                    ...room.dataValues,
                    lastMessage: messages[messages.length - 1] || null,
                };
            })
        );

        matchedRoomsAndMessages.sort((a, b) => {
            if (a.lastMessage && b.lastMessage)
                return b.lastMessage.createdAt - a.lastMessage.createdAt;
            else return b.createdAt - a.createdAt;
        });

        const searchResults = {
            contacts: matchedContacts,
            chatRooms: matchedRoomsAndMessages,
        };

        return res.json(searchResults);
    })
);

module.exports = router;
