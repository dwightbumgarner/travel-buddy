const openai = require('openai')

class ChatGPTAPISingleton {
    constructor() {
        const CONFIG = new openai.Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });

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

    async getAIResponse(conversation) {
        console.log(conversation)
        const completion = await ChatGPTAPISingleton.client.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: conversation,
        });

        return completion.data.choices[0].message.content;
    }
}

module.exports = ChatGPTAPISingleton;