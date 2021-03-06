const express = require('express');
const { check } = require('express-validator');
const asyncHandler = require('express-async-handler');

const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, ChatRoom, Participant } = require('../../db/models');
const { Op } = require('sequelize');

const router = express.Router();

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Name cannot be blank'),
    check('phoneNumber')
        .exists({ checkFalsy: true })
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'g')
        .withMessage(
            'Password must contain at least 1 lowercase letter, uppercase letter, number, and special character.'
        ),
    check('confirmPassword')
        .exists({ checkFalsy: true })
        .withMessage('Password confirmation cannot be blank.')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords must match');
            }
            return true;
        }),
    handleValidationErrors,
];

// Sign up
router.post(
    '/',
    validateSignup,
    asyncHandler(async (req, res) => {
        const { email, password, name, phoneNumber } = req.body;

        const user = await User.signup({
            email,
            password,
            name,
            phoneNumber,
        });

        await setTokenCookie(res, user);

        return res.json({
            user,
        });
    })
);

// Add profile picture
router.put(
    '/',
    requireAuth,
    asyncHandler(async (req, res) => {
        const { imageUrl } = req.body;
        const user = await User.findByPk(req.user.id);
        user.update({
            profileUrl: imageUrl,
        });

        return res.json({ user });
    })
);

// Find all user rooms
router.put(
    '/chatrooms',
    asyncHandler(async (req, res) => {
        const { userId } = req.body;
        const user = await User.findByPk(userId);
        const rooms = await user.getAdmin();
        const userParticipant = await user.getParticipants();
        const allRooms = rooms.concat(userParticipant);

        const roomsAndMessages = await Promise.all(
            allRooms.map(async (room) => {
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

        roomsAndMessages.sort((a, b) => {
            if (a.lastMessage && b.lastMessage)
                return b.lastMessage.createdAt - a.lastMessage.createdAt;
            else if (a.lastMessage && !b.lastMessage) return 1;
            else if (!a.lastMessage && b.lastMessage) return -1;
            else return b.createdAt - a.createdAt;
        });

        return res.json({ rooms: roomsAndMessages });
    })
);

// Delete chat room
router.delete(
    '/chatrooms',
    requireAuth,
    asyncHandler(async (req, res) => {
        const { chatRoomId } = req.body;
        const chatRoom = await ChatRoom.findByPk(chatRoomId);
        const user = await User.findByPk(req.user.id);

        await chatRoom.setParticipants([]);
        await chatRoom.destroy({ cascade: true });

        const rooms = await user.getAdmin();
        const userParticipant = await user.getParticipants();
        const allRooms = rooms.concat(userParticipant);

        roomsAndMessages = await Promise.all(
            allRooms.map(async (room) => {
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
        roomsAndMessages.sort((a, b) => {
            if (a.lastMessage && b.lastMessage)
                return b.lastMessage.createdAt - a.lastMessage.createdAt;
            else if (a.lastMessage && !b.lastMessage) return 1;
            else if (!a.lastMessage && b.lastMessage) return -1;
            else return b.createdAt - a.createdAt;
        });

        return res.json({ rooms: roomsAndMessages });
    })
);

// Edit user information
router.put(
    '/edit',
    requireAuth,
    asyncHandler(async (req, res) => {
        const { name, imageUrl, isPublic } = req.body;
        const user = await User.findByPk(req.user.id);
        if (name) user.update({ name });
        if (imageUrl) user.update({ profileUrl: imageUrl });
        if (isPublic) user.update({ isPublic });
        return res.json({ user });
    })
);

// Search user contacts
router.put(
    '/search',
    requireAuth,
    asyncHandler(async (req, res) => {
        const user = req.user;
        const { searchInput } = req.body;
        const contacts = await user.getUserContacts();
        const contactIds = contacts.map((contact) => contact.id);

        const results = await User.findAll({
            where: {
                isPublic: true,
                id: {
                    [Op.ne]: user.id,
                    [Op.notIn]: contactIds,
                },
                [Op.or]: {
                    name: {
                        [Op.iLike]: `${searchInput}%`,
                    },
                    phoneNumber: {
                        [Op.iLike]: `${searchInput}%`,
                        [Op.not]: user.phoneNumber,
                    },
                },
            },
        });
        return res.json({ results });
    })
);

// Add user to contacts
router.post(
    '/contacts',
    requireAuth,
    asyncHandler(async (req, res) => {
        const { userId } = req.body;

        const loggedInUser = await User.getCurrentUserById(req.user.id);
        const userToAdd = await User.findByPk(userId);

        await loggedInUser.addUserContacts(userToAdd);
        const userContacts = await loggedInUser.getUserContacts();

        return res.json({ userContacts });
    })
);

// Find user contacts
router.put(
    '/contacts',
    requireAuth,
    asyncHandler(async (req, res) => {
        const loggedInUser = await User.getCurrentUserById(req.user.id);
        const userContacts = await loggedInUser.getUserContacts();

        return res.json({ userContacts });
    })
);

// Delete contact
router.delete(
    '/contacts',
    requireAuth,
    asyncHandler(async (req, res) => {
        const { contactId } = req.body;
        const user = await User.findByPk(req.user.id);
        await user.removeUserContact(contactId);
        const userContacts = await user.getUserContacts();
        return res.json({ userContacts });
    })
);

module.exports = router;
