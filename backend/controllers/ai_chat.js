const OpenAIAPISingleton = require('../third_party/chatgpt');
const openAIAPI = OpenAIAPISingleton.getInstance();

module.exports.chatWithAI = async (req, res) => {
    const { userEmail, userInput } = req.body;

    console.log('received a chat with AI req with user input', userInput);


    try {
        const response = await openAIAPI.getAIResponse(userEmail, userInput);

        console.log("Response from AI:", response);
        res.status(200).json({response});
    } catch (error) {
        console.error("Error getting AI responses:", error);
    }
}

module.exports.endChat = async (req, res) => {
    const { userEmail } = req.body;

    console.log('received a end chat req by user', userEmail);


    try {
        openAIAPI.endChatForUser(userEmail);

        console.log("Chat ended for user", userEmail);
        res.status(200).json({response: 'Chat History Cleared.'});
    } catch (error) {
        console.error("Error ending chat for user", error);
    }
}