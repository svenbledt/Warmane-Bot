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

module.exports = { https }; 