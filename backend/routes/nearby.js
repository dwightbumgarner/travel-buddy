const express = require('express');
const {
    getNearbyPOIList
} = require('../controllers/nearby');

const nearbyRouter = express.Router();

nearbyRouter.post('/nearby', getNearbyPOIList);

module.exports = nearbyRouter;
