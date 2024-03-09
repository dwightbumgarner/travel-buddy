const OpenAIAPISingleton = require('../third_party/chatgpt');
const openAIAPI = OpenAIAPISingleton.getInstance();

/**
 * Handles a chat request with AI, responding to user input.
 *
 * @param {object} req - The request object, containing the user's conversation history in the body.
 * @param {object} res - The response object used to send back the AI's response or an error message.
 */
module.exports.chatWithAI = async (req, res) => {
    try {
        const conversation = req.body.conversation;
        console.log('received a chat with AI req with user input', conversation.slice(-1)[0].content);

        const response = await openAIAPI.getAIResponse(conversation);

        console.log("Response from AI:", response);
        res.status(200).json({response});
    } catch (error) {
        console.error("Error getting AI responses:", error);
    }
}

// /**
//  * Fetches a list of nearby Points of Interest (POIs) based on the user's location.
//  *
//  * @param {object} req - The request object, containing the latitude and longitude in the body.
//  * @param {object} res - The response object used to send back the list of nearby POIs or an error message.
//  */
// module.exports.getNearbyPOIList = async (req, res) => {
//     try {
//         const { latitude, longitude } = req.body;
//         console.log(`received a get nearby POIs req with user location { ${latitude}, ${longitude} }`);

//         const list = await openAIAPI.getNearbyPOIList(latitude, longitude);

//         if (list.length !== 5) {
//             console.log("AI failed to provide 5 nearby POIs", list);
//             res.status(400).json({list});
//         }
//         else {
//             console.log("AI successfully provided 5 nearby POIs:", list)
//             res.status(200).json({
//                 POIList: list,
//             });
//         }
//     } catch (error) {
//         console.error("Error fetching 5 nearby POIs from AI:", error);
//     }
// }
