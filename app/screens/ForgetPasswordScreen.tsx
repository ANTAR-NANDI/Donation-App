import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import BASE_URL from "../../config";
import { useTranslation } from "react-i18next";

export default function ForgotPassword({ navigation }) {
  const { t } = useTranslation();
  const [phone, setPhone] = useState("");
  const [errorMessages, setErrorMessages] = useState({});

  const validateForm = () => {
    if (!phone.trim()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Enter Your Phone Number.",
      });
      return false;
    }
    return true;
  };

  const renderError = (field) => {
    return errorMessages?.[field]?.map((msg, idx) => (
      <Text key={idx} style={styles.errorText}>
        {msg}
      </Text>
    ));
  };

  const sendOTP = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post(`${BASE_URL}/member/send_otp`, {
        phone,
      });

      if (response.data.status) {
        Toast.show({
          type: "success",
          text1: "Successful",
          text2: "OTP has been sent!",
        });

        setTimeout(() => {
          navigation.replace("ResetPassword", { phone });
        }, 500);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: response.data.message || "Something went wrong.",
        });
      }
    } catch (error) {
      console.log("Error sending OTP:", error?.response?.data || error);
      if (error.response?.status === 422) {
        // Validation error from backend
        setErrorMessages(error.response.data.errors || {});
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to send OTP. Try again.",
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/topoban.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>{t("forget_password_form")}</Text>
      <Text style={styles.subtitle}>{t("forget_password_heading")}</Text>

      <TextInput
        style={styles.input}
        placeholder={t("phone_placeholder")}
        placeholderTextColor="#5a3d31"
        value={phone}
        onChangeText={(text) => {
          setPhone(text);
          setErrorMessages({}); // Clear previous errors on change
        }}
        keyboardType="phone-pad"
      />
      {renderError("phone")}

      <TouchableOpacity style={styles.button} onPress={sendOTP}>
        <Text style={styles.buttonText}>{t("send_otp")}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.signInText}>{t("signin")}</Text>
      </TouchableOpacity>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c8a17b",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#5a3d31",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#5a3d31",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#5a3d31",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f4e4c3",
    color: "#5a3d31",
    fontSize: 16,
    marginBottom: 5,
  },
  errorText: {
    color: "#b00020",
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "#5a3d31",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  buttonText: {
    color: "#f4e4c3",
    fontSize: 16,
    fontWeight: "bold",
  },
  signInText: {
    color: "#5a3d31",
    textDecorationLine: "underline",
    fontSize: 16,
  },
});
