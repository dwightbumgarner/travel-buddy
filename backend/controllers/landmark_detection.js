const fs = require('fs');
const GCPLandmarkSingleton = require('../third_party/google_lens');

module.exports.detectLandmark = async (req, res) => {
    try {
        console.log('recevied a landmark detection req', req);

        const landmarkDetector = GCPLandmarkSingleton.getInstance();
        const filePath = req.file.path;

        const result = await landmarkDetector.detectLandmark(filePath);
        const landmarks = result.landmarkAnnotations.map(annotation => annotation.description);

        console.log("Landmark Detection Result:", result);
        console.log("Landmark Detection Landmarks:", landmarks);
        res.status(200).json({landmarks});
    } catch (error) {
        console.error("Error detecting landmarks:", error);
    } finally {
        fs.unlinkSync(req.file.path);
        console.log('removed uploaded file');
    }
}
