const express = require('express');
const router = express.Router();
const { createShortenedURL } = require('../modules/database');

// POST endpoint to add a new URL and generate a shortened URL
router.post('/addURL', async (req, res) => {
    const { url } = req.body;

    // Check if the 'url' field is missing in the request body
    if (!url) {
        return res.status(400).json({ success: false, error: 'Missing required fields: url' });
    }

    try {
        // Call createShortenedURL function to create a shortened URL
        const shortenedURL = await createShortenedURL(url);

        // Return the shortened URL in the response
        res.json(shortenedURL);
    } catch (error) {
        // Handle errors if creating shortened URL fails
        console.error('Error creating shortened URL:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;
