const fs = require('fs');
const GCPLandmarkSingleton = require('../third_party/google_lens');

/**
 * Converts degrees to radians
 * @param {number} degrees
 * @returns {number} Radians
 */
const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180);
}

/**
 * Calculates the Haversine distance between two points on the Earth.
 * @param {number} lat1 Latitude of the first point
 * @param {number} lon1 Longitude of the first point
 * @param {number} lat2 Latitude of the second point
 * @param {number} lon2 Longitude of the second point
 * @returns {number} The distance in kilometers
 */
const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

const isLandmarkCloseToUser = (userLatitude, userLongitude, landmarkCoords, threshold) => {
    const distance = haversineDistance(userLatitude, userLongitude, landmarkCoords.latitude, landmarkCoords.longitude);
    console.log(distance);
    return distance <= threshold;
}

module.exports.detectLandmark = async (req, res) => {
    try {
        console.log('recevied a landmark detection req', req);

        const landmarkDetector = GCPLandmarkSingleton.getInstance();
        const filePath = req.file.path;
        const {latitude, longitude} = req.body;

        console.log('user coords', {latitude, longitude});

        const result = await landmarkDetector.detectLandmark(filePath);

        // coords = {'latitude': xx, 'longitude': xx}
        const coords = result.landmarkAnnotations.map(annotation => annotation.locations[0].latLng);
        const landmarks = result.landmarkAnnotations.map(annotation => annotation.description);

        console.log("Landmark Detection Result:", result);
        console.log("Landmark Detection Landmarks:", landmarks);
        console.log("Landmark coords:", coords);

        const closeLandmarks = landmarks.filter((_, index) => {
            const landmarkCoords = coords[index];
            console.log(landmarkCoords);

            const threshold = 15; // 15km
            return isLandmarkCloseToUser(latitude, longitude, landmarkCoords, threshold);
        });

        console.log('Close landmarks:', closeLandmarks);

        res.status(200).json({landmarks: closeLandmarks});
    } catch (error) {
        console.error("Error detecting landmarks:", error);
        res.status(500).json({error});
    } finally {
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }

        console.log('removed uploaded file');
    }
}
