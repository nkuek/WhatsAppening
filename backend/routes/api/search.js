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

        const matchedRooms = await user.getParticipants({
            where: {
                name: {
                    [Op.iLike]: `%${searchQuery}%`,
                },
            },
        });

        const searchResults = {
            contacts: matchedContacts,
            chatRooms: matchedRooms,
        };

        return res.json(searchResults);
    })
);

module.exports = router;
