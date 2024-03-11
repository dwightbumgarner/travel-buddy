const express = require('express');
const {
    getNearbyPOIList
} = require('../controllers/nearby');
const { verifyAuthentication } = require('../middlewares/auth');

const nearbyRouter = express.Router();

nearbyRouter.post('/', verifyAuthentication, getNearbyPOIList);

module.exports = nearbyRouter;
