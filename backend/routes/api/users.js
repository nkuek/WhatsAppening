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

router.put(
    '/',
    requireAuth,
    asyncHandler(async (req, res) => {
        console.log(req.user.id);
        const { imageUrl } = req.body;
        const user = await User.findByPk(req.user.id);
        console.log('before', user);
        user.update({
            profileUrl: imageUrl,
        });

        console.log('after');

        return res.json({ user });
    })
);

router.put(
    '/chatrooms',
    asyncHandler(async (req, res) => {
        const { userId } = req.body;
        const rooms = await ChatRoom.findAll({
            where: {
                adminId: userId,
            },
        });
        return res.json({ rooms });
    })
);

module.exports = router;
