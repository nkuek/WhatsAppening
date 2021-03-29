const express = require('express');
const { check } = require('express-validator');
const asyncHandler = require('express-async-handler');

const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('firstName')
        .exists({ checkFalsy: true })
        .withMessage('First name cannot be blank'),
    check('lastName')
        .exists({ checkFalsy: true })
        .withMessage('Last name cannot be blank'),
    check('phoneNumber')
        .exists({ checkFalsy: true })
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors,
];

// Sign up
router.post(
    '/',
    validateSignup,
    asyncHandler(async (req, res) => {
        const { email, password, firstName, lastName, phoneNumber } = req.body;
        const user = await User.signup({
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
        });

        await setTokenCookie(res, user);

        return res.json({
            user,
        });
    })
);

module.exports = router;
