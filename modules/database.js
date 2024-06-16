const mysql = require('mysql2');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../config/.env') });

// Create MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Create a promise-based pool to use async/await
const promisePool = pool.promise();

/**
 * Creates a shortened URL entry in the database.
 * @param {string} url - The original URL to be shortened.
 * @returns {Object} - Object indicating success and the shortened URL.
 */
async function createShortenedURL(url) {
    // Generate a short URL key
    const shortend = await generateURL();

    // Insert the original URL and shortened URL into the database
    const [result] = await promisePool.query(
        'INSERT INTO `urls`(`origin`, `shortened`) VALUES (?,?)',
        [url, shortend]
    );

    // Return success and the shortened URL
    return {
        success: true,
        shortCode: process.env.WEBSITE_URL + "/" + shortend
    };
}

/**
 * Retrieves the original URL from the shortened URL key.
 * @param {string} shortened - The shortened URL key.
 * @returns {Object} - Object indicating the status and the full original URL.
 */
async function getFullURL(shortened) {
    try {
        // Query the database to get the original URL associated with the shortened URL key
        const [query] = await promisePool.query(
            'SELECT origin FROM `urls` WHERE shortened=?',
            [shortened]
        );

        // If no matching record found, return status "Invalid"
        if (query.length <= 0) {
            return {
                status: "Invalid"
            };
        }

        // Return success status and the full original URL
        return {
            status: "success",
            fullURL: query[0].origin
        };
    } catch(error) {
        // Handle any errors that occur during database query
        console.error(error);
        return {
            status: "internal"
        };
    }
}

/**
 * Checks if a shortened URL key already exists in the database.
 * @param {string} url - The shortened URL key to check.
 * @returns {boolean} - True if the shortened URL key exists, false otherwise.
 */
async function doesURLExits(url) {
    // Query the database to check if the shortened URL key exists
    const [query] = await promisePool.query(
        'SELECT shortened FROM `urls` WHERE shortened=?',
        [url]
    );
    return query.length > 0;
}

/**
 * Generates a unique shortened URL key.
 * @returns {string} - The generated shortened URL key.
 */
async function generateURL() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    // Generate a random string based on the configured length in process.env.SHORTEND
    while (counter < process.env.SHORTEND) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    // If generated key already exists, recursively generate a new one until unique
    if (await doesURLExits(result)) {
        return generateURL();
    }
    return result;
}

module.exports = {
    createShortenedURL,
    getFullURL
};
