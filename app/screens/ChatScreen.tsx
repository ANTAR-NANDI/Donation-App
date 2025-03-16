import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatView = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello, how are you?', sender: 'received' },
    { id: '2', text: 'I am doing great, thanks!', sender: 'sent' },
    { id: '3', text: 'What about you?', sender: 'received' },
  ]);

  // Handle message send
  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        id: (messages.length + 1).toString(),
        text: message,
        sender: 'sent',
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.sender === 'sent' ? styles.sentMessage : styles.receivedMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        inverted
        contentContainerStyle={styles.messageList}
      />

      {/* Input container */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          placeholderTextColor="#999"
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="#FFF" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 20,
    paddingHorizontal: 15,  // Added padding here
  },
  messageList: {
    paddingBottom: 20, // Padding at the bottom for message spacing
  },
  messageContainer: {
    padding: 12,
    marginVertical: 8,
    maxWidth: '80%',
    borderRadius: 10,
  },
  sentMessage: {
    backgroundColor: '#4D2600',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#FFF',
    borderColor: '#4D2600',
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#FFF',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,  // Added padding here for spacing
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginBottom: 15, // Added margin at the bottom of the input field
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    paddingVertical: 12,
    paddingLeft: 15,
    fontSize: 16,
    marginRight: 10, // Space between input and send button
  },
  sendButton: {
    backgroundColor: '#4D2600',
    borderRadius: 25,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatView;
