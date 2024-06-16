const mysql = require('mysql2');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../config/.env') });

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
const promisePool = pool.promise();



async function createShortenedURL(url) {
    const shortend = await generateURL()
    const [result] = await promisePool.query(
        'INSERT INTO `urls`(`origin`, `shortened`) VALUES (?,?)',
        [url, shortend]
    );
    return {
        success: true,
        shortCode: process.env.WEBSITE_URL + "/" +shortend
    }
}

async function getFullURL(shortened) {
    try {
        const [query] = await promisePool.query(
            'SELECT origin FROM `urls` WHERE shortened=?',
            [shortened]
        );
        if (query.length <= 0) {
            return {
                status: "Invalid"
            }
        }
        return {
            status: "success",
            fullURL: query[0].origin
        }
    } catch(error) {
        console.error(error)
        return {
            status: "internal"
        }
    }

}

/**
 * Checks if a license exists in the database.
 * @param {string} url - The url key.
 * @returns {boolean} - True if the license exists, false otherwise.
 */
async function doesURLExits(url) {
    const [query] = await promisePool.query(
        'SELECT shortened FROM `urls` WHERE shortened=?',
        [url]
    );
    return query.length > 0;
}

/**
 * Generates a unique URL key.
 * @returns {string} - The generated URL key.
 */
async function generateURL() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < process.env.SHORTEND) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    if (await doesURLExits(result)) {
        return generateLicense();
    }
    return result;
}
module.exports = {
    createShortenedURL,
    getFullURL
};
