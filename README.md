# URL Shortener Service

This repository contains a Node.js and Express.js backend application designed for managing URL shortening operations through a RESTful API. It provides endpoints for creating shortened URLs and redirecting to original URLs based on the shortened link. It also serves a landing page and a custom 404 error page for invalid URLs.

## Features

- **URL Shortening**
  - Create shortened URLs from long URLs.
  - Redirect to the original long URL using the shortened link.
  
- **Custom Pages**
  - Serve a static landing page.
  - Serve a custom 404 error page for invalid shortened URLs. (credits to https://github.com/tsparticles/404-templates)

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Additional Libraries**: dotenv for environment configuration, body-parser for JSON parsing, cors for handling Cross-Origin Resource Sharing

## Setup Instructions

1. **Clone the repository:**
   ```sh
   git clone https://github.com/PhilCode-creator/URL-Shortener.git
   cd url-shortener-service
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the `config` directory.
   - Define necessary variables (e.g., database connection string).

4. **Start the server:**
   ```sh
   npm start
   ```

## API Documentation

### Create Shortened URL

- **Endpoint**: `POST /api/create/addURL`
- **Body**:
  ```json
  {
    "url": "https://example.com/long-url"
  }
  ```

- **Response**:
  ```json
  {
    "success": true,
    "shortenedURL": "https://your-website.com/abcd1234"
  }
  ```

### Redirect Shortened URL

- **Endpoint**: `GET /:shortenedURL`
- **Description**: Redirects to the original long URL using the shortened URL.
- **Responses**:
  - **Success**: Redirects to the original URL.
  - **Invalid URL**: Serves the custom 404 page.
  - **Internal Server Error**: Returns a plain text error message.

## Contributing

Feel free to contribute by forking the repository and submitting pull requests for new features or bug fixes.

## License

This project is licensed under the MIT License.