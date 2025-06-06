import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import BASE_URL from "@/config";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
const ChatScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

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
  const imageToBase64 = async (uri) => {
    const manipResult = await ImageManipulator.manipulateAsync(uri, [], {
      base64: true,
    });
    return manipResult.base64;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      let image = null;
      const token = await AsyncStorage.getItem("@auth_token");

      let imageBase64 = null;
      if (image?.uri) {
        imageBase64 = await imageToBase64(image.uri);
      }

      const payload = {
        message,
        image: imageBase64,
      };
      console.log(payload);

      const response = await axios.post(`${BASE_URL}/member_message`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Toast.show({
        type: "success",
        text1: "Success",
        text2: response.data.message,
      });

      setTimeout(() => {
        navigation.replace("App");
      }, 1000);
    } catch (error) {
      console.log("AXIOS ERROR:", JSON.stringify(error, null, 2));

      Toast.show({
        type: "error",
        text1: "Upload failed",
        text2:
          error?.response?.data?.error ||
          error.message ||
          "Unknown error occurred",
      });
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
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

      <View style={styles.inputWrapper}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder={t("enter_message")}
          style={styles.input}
          multiline
        />

        <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
          <Text style={styles.imagePickerButtonText}>📷 Image</Text>
        </TouchableOpacity>

        {image && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: image.uri }} style={styles.imagePreview} />
            <TouchableOpacity onPress={() => setImage(null)}>
              <Text style={styles.removeImageText}>❌ {t("remove_image")}</Text>
            </TouchableOpacity>
          </View>
        )}

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

  inputWrapper: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
    marginBottom: 12,
    maxHeight: 120,
    textAlignVertical: "top",
  },

  imageLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
    color: "#333",
  },

  imagePickerButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 10,
  },

  imagePickerButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  imagePreviewContainer: {
    alignItems: "center",
    marginBottom: 12,
  },

  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  removeImageText: {
    color: "#ff4444",
    fontWeight: "bold",
    fontSize: 16,
  },

  sendButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  sendButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ChatScreen;
