// New utility file for HTTP client
const axios = require('axios');
const rateLimit = require('axios-rate-limit');

// Create rate-limited axios instance with improved settings
const https = rateLimit(axios.create({
    headers: {
        'User-Agent': 'Warmane-Tool/1.0',
        'Accept': 'application/json, text/html',
    },
}), {
    maxRequests: 1,
    perMilliseconds: 2000, // Reduced from 4000ms to 2000ms for better responsiveness
});

// Add response interceptor to handle 403 errors
https.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 403) {
            // Create a custom error for 403 responses
            const customError = new Error('Warmane services have blocked this request. Please try again later.');
            customError.isWarmaneBlocked = true;
            customError.status = 403;
            throw customError;
        }
        throw error;
    }
);

module.exports = { https }; 