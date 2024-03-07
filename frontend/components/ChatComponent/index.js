import React, { useState, useCallback } from 'react';
import { View, TextInput, Button, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { SERVER_URL } from '../../consts';
import SecureStorageManager from '../../storage';

const ChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [detectedLandmark, setDetectedLandmark] = useState(null);
    const [authToken, setAuthToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const secureStorage = SecureStorageManager.getInstance();

    const checkSecureStorage = async () => {
        try {
            const token = await secureStorage.get('authToken');
            setAuthToken(token);

            const landmark = await secureStorage.get('detectedLandmark');
            setDetectedLandmark(landmark);

            const response = await fetch(SERVER_URL + "/ai/chat", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authentication': authToken,
                },
                body: JSON.stringify({
                    conversation: [{ role: 'user', content: `I'm a tourist at ${landmark}. Please give me a short guide.` }],
                }),
            });
            const data = await response.json();
            console.log(data.response);
            if (data.response) {
                setMessages(prevMessages => [...prevMessages, { role: 'user', content: `I'm a tourist at ${landmark}. Please give me a short guide.` }, { role: 'assistant', content: data.response }]);
            }
        } catch (error) {
            console.log('Error fetching from storage:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            checkSecureStorage();
        }, [loading])
    );

    const sendMessage = async () => {
        if (!userInput) {
            Alert.alert('You typed nothing!');
            return;
        }

        console.log('sending message to AI');
        const conversation = messages.slice();
        conversation.push({ role: 'user', content: userInput });
        console.log(conversation);

        setMessages(prevMessages => [...prevMessages, { role: 'user', content: userInput }]);
        const response = await fetch(SERVER_URL + "/ai/chat", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authentication': authToken,
            },
            body: JSON.stringify({
                conversation: conversation,
            }),
        });
        const data = await response.json();
        setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: data.response }]);
        setUserInput('');
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (detectedLandmark === null) {
        return (
            <View style={styles.center}>
                <Text>You need to open detect screen to detect a landmark before you can learn about it</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                {messages.map((msg, index) => (
                    <View key={index} style={msg.role === 'user' ? styles.userMessageBubble : styles.botMessageBubble}>
                        <Text style={styles.messageText}>
                            {msg.content}
                        </Text>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.inputArea}>
                <TextInput
                    style={styles.input}
                    value={userInput}
                    onChangeText={(text) => setUserInput(text)}
                    placeholder="Type a message..."
                />
                <Button title="Send" onPress={sendMessage} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    scrollViewContainer: {
        padding: 10,
    },
    inputArea: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        marginRight: 16,
        padding: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
    },
    userMessageBubble: {
        backgroundColor: '#DCF8C6',
        padding: 10,
        borderRadius: 20,
        marginVertical: 5,
        maxWidth: '80%',
        alignSelf: 'flex-end',
        marginRight: 10,
    },
    botMessageBubble: {
        backgroundColor: '#ECECEC',
        padding: 10,
        borderRadius: 20,
        marginVertical: 5,
        maxWidth: '80%',
        alignSelf: 'flex-start',
        marginLeft: 10,
    },
    messageText: {
        fontSize: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChatScreen;
