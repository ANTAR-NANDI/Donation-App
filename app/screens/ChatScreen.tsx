import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import BASE_URL from "@/config";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const ChatScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/member_messages`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${await AsyncStorage.getItem(
              "@auth_token"
            )}`,
          },
        });
        setMessages(Object.values(response.data.messages));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const validateForm = () => {
    if (!message.trim()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Message is required.",
      });
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    try {
      const response = await axios.post(
        `${BASE_URL}/member_message`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem(
              "@auth_token"
            )}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("");
      setMessages(Object.values(response.data.messages));
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Message sent successfully!",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.error || "Something went wrong",
      });
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.chatContainer}
        extraScrollHeight={Platform.OS === "ios" ? 20 : 80}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        {loading ? (
          <Text style={styles.loadingText}>{t("loading_message")}</Text>
        ) : messages.length > 0 ? (
          messages.map((item, index) => (
            <View
              key={index}
              style={[
                styles.messageRow,
                item.send_from === "admin" ? styles.received : styles.sent,
              ]}
            >
              <View style={styles.messageContent}>
                <Text style={styles.messageText}>{item.message}</Text>
                <Text style={styles.messageTime}>
                  {new Date(item.date).toLocaleString()}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noMessagesText}>{t("no_message")}</Text>
        )}
      </KeyboardAwareScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder={t("enter_message")}
          style={styles.input}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleRegister}>
          <Text style={styles.sendButtonText}>{t("send")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  chatContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
    color: "gray",
  },
  noMessagesText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
    color: "gray",
  },
  messageRow: {
    marginBottom: 10,
    maxWidth: "80%",
  },
  sent: {
    alignSelf: "flex-end",
    backgroundColor: "#d4f4d1",
    borderRadius: 12,
    padding: 10,
  },
  received: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f0f0",
    borderRadius: 12,
    padding: 10,
  },
  messageContent: {
    flexDirection: "column",
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#f1f0f0",
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#bc1d21",
    padding: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ChatScreen;
