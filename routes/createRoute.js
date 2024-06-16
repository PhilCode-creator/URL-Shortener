// routes/createRoute.js

const express = require('express');
const router = express.Router();
const { createShortenedURL } = require('../modules/database');

router.post('/addURL', async (req, res) => {
    const { url } = req.body;

    // Check if the 'url' field is missing
    if (!url) {
        return res.status(400).json({ success: false, error: 'Missing required fields: url' });
    }

    try {
        const shortenedURL = await createShortenedURL(url);
        res.json(shortenedURL);
    } catch (error) {
        console.error('Error creating shortened URL:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;
