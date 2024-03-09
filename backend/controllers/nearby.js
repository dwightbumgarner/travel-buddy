const FirebaseSingleton = require('../third_party/db');
const firebaseInstance = FirebaseSingleton.getInstance();
const db = firebaseInstance.getDatabase();

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
                const distance = Math.sqrt(Math.pow(forum.lat - latitude, 2) + Math.pow(forum.lon - longitude, 2));
                return { ...forum, distance };
            })
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5);

        res.status(200).json(nearbyForums);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching nearby forums' });
    }
}