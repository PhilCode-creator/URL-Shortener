const {getFullURL} = require('./modules/database')
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

// Specify the path to the .env file
dotenv.config({ path: './config/.env' });

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.use(cors());
app.use(express.static('public/landingpage')); // Serve static files from the 'public/landingpage' directory
app.use(express.static('public/404')); // Serve static files from the 'public/404' directory

// Import router
const createRouter = require('./routes/createRoute');

// Routes
app.use('/api/create', createRouter);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/landingpage/index.html');
});

app.get('*', async (req, res) => {
    var path = req.originalUrl; // Get the original URL path requested
    path = path.replace("/", "")
    const result = await getFullURL(path)
    if(result.status == "Invalid") {
        res.sendFile(__dirname + '/public/404/404.html');
    } else if(result.status == "internal") {
        res.send("internal Server Error")
    } else  if(result.status == "success") {
        res.redirect(result.fullURL);
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
