const openai = require('openai')

class ChatGPTAPISingleton {
    constructor() {
        const CONFIG = new openai.Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });

        this.userChatHistory = new Map();

        if (!ChatGPTAPISingleton.client) {
            ChatGPTAPISingleton.client =  new openai.OpenAIApi(CONFIG);
            console.log('ChatGPT API client initialized');
        }
    }

    static getInstance() {
        if (!ChatGPTAPISingleton.instance) {
            ChatGPTAPISingleton.instance = new ChatGPTAPISingleton();
        }
        return ChatGPTAPISingleton.instance;
    }

    async getAIResponse(userEmail, userInput) {
        if (!this.userChatHistory.has(userEmail)) {
            this.userChatHistory.set(userEmail, []);
        }
        this.userChatHistory.get(userEmail).push(['user', userInput]);
        const messages = this.userChatHistory.get(userEmail).map(([role, content]) => ({
            role,
            content,
        }));
        const completion = await ChatGPTAPISingleton.client.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: messages,
        });

        const response = completion.data.choices[0].message.content;
        this.userChatHistory.get(userEmail).push(['assistant', response]);
        return response;
    }

    endChatForUser(userEmail) {
        try {
            this.userChatHistory.delete(userEmail);
        } catch (error) {
            console.error(`Error deleting chat history for user ${userEmail}: ${error}`);
        }
    }
}

module.exports = ChatGPTAPISingleton;