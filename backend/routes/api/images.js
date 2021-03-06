const express = require('express');
const asyncHandler = require('express-async-handler');
const { singleMulterUpload, singlePublicFileUpload } = require('../../awsS3');

const router = express.Router();

// Dedicated api route to upload to AWS and generate image URL
router.post(
    '/',
    singleMulterUpload('image'),
    asyncHandler(async (req, res) => {
        const imageUrl = await singlePublicFileUpload(req.file);
        return res.json(imageUrl);
    })
);

module.exports = router;
