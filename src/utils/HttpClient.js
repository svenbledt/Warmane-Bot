// New utility file for HTTP client
const axios = require('axios');

const https = axios.create({
    maxRequests: 1,
    perMilliseconds: 4000,
    headers: {
        'User-Agent': 'Warmane-Tool/1.0',
        'Accept': 'application/json, text/html',
    },
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