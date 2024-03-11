import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { SERVER_URL } from '../../consts';
import SecureStorageManager from '../../storage';
import POIComponent from '../POIComponent';

const parseTimestamp = (timestamp) => {
  if (timestamp && timestamp.seconds) {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }
  return 'Now';
};

const ForumCommentScreen = ({ route }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollViewRef = useRef();
    const [authToken, setAuthToken] = useState(null);
    const { forumId, name, imageURL, rating } = route.params;
    const secureStorage = SecureStorageManager.getInstance();

    const fetchComments = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${SERVER_URL}/forum/getComment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authentication': authToken,
                },
                body: JSON.stringify({
                    forumId: forumId,
                }),
            });
            const data = await response.json();
            if (data) {
                setComments(data.comments);
            } else {
                Alert.alert("Error", "Failed to fetch comments.");
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            Alert.alert("Error", "An error occurred while fetching comments.");
        }
        setLoading(false);
    };

    const addComment = async () => {
        if (!newComment.trim()) {
            Alert.alert('Error', 'Comment cannot be empty.');
            return;
        }

        const userFullName = await secureStorage.get('userName');
        const optimisticComment = {
            content: newComment,
            timestamp: { seconds: Date.now() / 1000, nanoseconds: 0 },
            user: userFullName,
        };
        
        setComments(prevComments => [...prevComments, optimisticComment]);
        setNewComment('');

        try {
            const response = await fetch(`${SERVER_URL}/forum/addComment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authentication': authToken,
                },
                body: JSON.stringify({
                    forumId: forumId,
                    content: newComment,
                }),
            });

            if (!response.ok) {
                Alert.alert("Error", "Failed to post comment.");
                setComments(prevComments => prevComments.filter(c => c !== optimisticComment));
            }
        } catch (error) {
            console.error('Error posting comment:', error);
            Alert.alert("Error", "An error occurred while posting the comment.");
            setComments(prevComments => prevComments.filter(c => c !== optimisticComment));
        }
    };

    useEffect(() => {
        const checkAuthToken = async () => {
          try {
            const token = await secureStorage.get('authToken');
            setAuthToken(token);
          } catch (error) {
            console.log('Error fetching auth token:', error);
          } finally {
            setLoading(false);
          }
        };
    
        checkAuthToken();
      }, []);

    useFocusEffect(
        useCallback(() => {
            if (authToken) {
                fetchComments();
            }
        }, [authToken])
    );

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <View style={styles.POIContainer}>
                <POIComponent
                    key={forumId}
                    name={name}
                    imageURL={imageURL}
                    rating={rating || 0}
                    disabled={false}
                    forumId={forumId}
                />
            </View>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2b2a29" />
                </View>
            ) : (
                <ScrollView
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                    style={styles.commentsContainer}
                >
                    {comments.map((comment, index) => (
                        <View key={index} style={styles.comment}>
                            <Text style={styles.commentUser}>{comment.user || 'Placeholder User'}</Text>
                            <Text style={styles.commentText}>{comment.content}</Text>
                            <Text style={styles.commentTimestamp}>{parseTimestamp(comment.timestamp)}</Text>
                        </View>
                    ))}
                </ScrollView>
            )}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newComment}
                    onChangeText={setNewComment}
                    placeholder="Write a comment..."
                    multiline
                />
                <TouchableOpacity style={styles.sendButton} onPress={addComment}>
                    <Text style={styles.buttonText}>Post</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2e7d6',
    },
    commentsContainer: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    comment: {
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 5,
        borderRadius: 20,
        alignSelf: 'stretch', 
        marginHorizontal: 10,
    },
    commentUser: {
        fontWeight: 'bold',
    },
    commentText: {
        fontSize: 16,
    },
    commentTimestamp: {
        fontSize: 12,
        color: 'gray',
        marginTop: 4,
    },
    inputContainer: {
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
    },
    sendButton: {
        backgroundColor: '#729c70',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    POIContainer: {
        marginHorizontal: 20,
        marginVertical: 10,
    },
});

export default ForumCommentScreen;