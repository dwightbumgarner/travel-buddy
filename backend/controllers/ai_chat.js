const OpenAIAPISingleton = require('../third_party/chatgpt');
const openAIAPI = OpenAIAPISingleton.getInstance();

module.exports.chatWithAI = async (req, res) => {
    const conversation = req.body.conversation;

    console.log('received a chat with AI req with user input', conversation.slice(-1)[0].content);


    try {
        const response = await openAIAPI.getAIResponse(conversation);

        console.log("Response from AI:", response);
        res.status(200).json({response});
    } catch (error) {
        console.error("Error getting AI responses:", error);
    }
}