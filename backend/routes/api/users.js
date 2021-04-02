const express = require('express');
const { check } = require('express-validator');
const asyncHandler = require('express-async-handler');

const { singleMulterUpload, singlePublicFileUpload } = require('../../awsS3');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { ChatRoom } = require('../../db/models');

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
            'Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'
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

router.put(
    '/chatrooms',
    asyncHandler(async (req, res) => {
        const { userId } = req.body;
        const user = await User.findByPk(userId);
        const rooms = await user.getAdmin();
        const userParticipant = await user.getParticipants();
        const allRooms = rooms.concat(userParticipant);

        roomsAndMessages = await Promise.all(
            allRooms.map(async (room) => {
                const messages = await room.getMessages();
                return {
                    ...room.dataValues,
                    lastMessage: messages[messages.length - 1],
                };
            })
        );
        roomsAndMessages.sort((a, b) => {
            if (a.lastMessage && b.lastMessage)
                return b.lastMessage.createdAt - a.lastMessage.createdAt;
        });
        console.log(roomsAndMessages);

        console.log(roomsAndMessages);
        // const messages = await Promise.all(
        //     allRooms.map(async (room) => room.getMessages())
        // );

        return res.json({ rooms: roomsAndMessages });
    })
);

router.put(
    '/edit',
    requireAuth,
    asyncHandler(async (req, res) => {
        const { name, imageUrl } = req.body;
        const user = await User.findByPk(req.user.id);
        user.update({ name });
        if (imageUrl) user.update({ profileUrl: imageUrl });
        return res.json({ user });
    })
);

module.exports = router;
