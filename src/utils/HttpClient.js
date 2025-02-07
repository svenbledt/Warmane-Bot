// New utility file for HTTP client
const axios = require('axios');
const rateLimit = require('axios-rate-limit');

const https = rateLimit(axios.create(), {
    maxRequests: 1,
    perMilliseconds: 4000,
});

module.exports = { https }; 