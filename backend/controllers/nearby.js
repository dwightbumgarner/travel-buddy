const FirebaseSingleton = require('../third_party/db');
const firebaseInstance = FirebaseSingleton.getInstance();
const db = firebaseInstance.getDatabase();

/**
 * Calculates the distance (in kilometers) between two points on the Earth's surface
 * using the Haversine formula.
 *
 * @param {number} lat1 - The latitude of the first point.
 * @param {number} lon1 - The longitude of the first point.
 * @param {number} lat2 - The latitude of the second point.
 * @param {number} lon2 - The longitude of the second point.
 * @returns {number} The distance between the two points in kilometers.
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}

/**
 * Converts degrees to radians.
 *
 * @param {number} deg - The angle in degrees.
 * @returns {number} The angle in radians.
 */
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

/**
 * Fetches a list of nearby Points of Interest (POIs) based on the user's location.
 *
 * @param {object} req - The request object, containing the latitude and longitude in the body.
 * @param {object} res - The response object used to send back the list of nearby POIs or an error message.
 */
module.exports.getNearbyPOIList = async (req, res) => {
    const { latitude, longitude } = req.body;
    console.log(`received a get nearby POIs req with user location { ${latitude}, ${longitude} }`);

    try {
        const forumsCollection = db.collection('forums');
        const querySnapshot = await forumsCollection.get();
        const allForums = querySnapshot.docs.map(doc => doc.data());
        const nearbyForums = allForums
            .map(forum => {
                const distance = calculateDistance(latitude, longitude, forum.lat, forum.lon);
                return { ...forum, distance };
            })
            .filter(forum => forum.distance < 15)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5);

        res.status(200).json(nearbyForums);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching nearby forums' });
    }
}