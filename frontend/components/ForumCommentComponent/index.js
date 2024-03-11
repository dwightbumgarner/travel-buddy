import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, TextInput, Button, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
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

        setNewComment('');
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
                    <ActivityIndicator size="large" color="#0000ff" />
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
                <Button title="Post" onPress={addComment} />
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
        borderTopWidth: 1,
        borderColor: '#cccccc',
        padding: 10,
        paddingBottom: 40,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        marginRight: 10,
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#cccccc',
    },
    POIContainer: {
        margin: 10
    },
});

export default ForumCommentScreen;