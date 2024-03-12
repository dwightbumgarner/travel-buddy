import React, { useState, useCallback, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, ScrollView, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { SERVER_URL } from '../../consts';
import SecureStorageManager from '../../storage';
import POIComponent from '../POIComponent';

const ChatScreen = ({ route }) => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [authToken, setAuthToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const { forumId, name, imageURL, rating } = route.params;

    const secureStorage = SecureStorageManager.getInstance();
    const scrollViewRef = useRef();

    const checkSecureStorage = async () => {
        try {
            const token = await secureStorage.get('authToken');
            setAuthToken(token);

            const landmark = await secureStorage.get('detectedLandmark');

            const response = await fetch(SERVER_URL + "/ai/chat", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authentication': authToken,
                },
                body: JSON.stringify({
                    conversation: [{ role: 'assistant', content: `Your goal is to assist the user with information about ${landmark}. Send the user a brief welcome message from TravelBuddy (without emojis) and ask what the user wants to learn about this landmark.` }],
                }),
            });
            const data = await response.json();
            console.log(data.response);
            if (data.response) {
                setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: data.response }]);
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
        setUserInput('');
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
        scrollViewRef.current.scrollToEnd({ animated: true });
    };

    if (loading) {
        return (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#2b2a29" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.POIContainer}>
                <POIComponent
                    key={forumId}
                    name={name}
                    imageURL={imageURL}
                    rating={rating || 0}
                    disabled={true}
                    forumId={forumId}
                />
            </View>
            <ScrollView
                contentContainerStyle={styles.scrollViewContainer}
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
            >
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
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.buttonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: '#f2e7d6',
        justifyContent: 'flex-end',
    },
    scrollViewContainer: {
        padding: 10,
    },
    inputArea: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fcf4e6',
        paddingBottom: 40,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -5,
        },
        shadowOpacity: 0.12,
        shadowRadius: 5.5,
    },
    input: {
        flex: 1,
        marginRight: 16,
        padding: 8,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: 20,
        height: 40,
    },
    userMessageBubble: {
        backgroundColor: '#caebab',
        padding: 10,
        borderRadius: 20,
        marginVertical: 5,
        maxWidth: '80%',
        alignSelf: 'flex-end',
        marginRight: 10,
    },
    botMessageBubble: {
        backgroundColor: '#fff',
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
    POIContainer: {
        marginHorizontal: 20,
        marginVertical: 10,
    },
    sendButton: {
        backgroundColor: '#729c70',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 40,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2e7d6',
    },
});

export default ChatScreen;
