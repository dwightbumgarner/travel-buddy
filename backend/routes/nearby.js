const express = require('express');
const {
    getNearbyPOIList
} = require('../controllers/nearby');

const nearbyRouter = express.Router();

nearbyRouter.get('/nearby', getNearbyPOIList);

module.exports = nearbyRouter;
