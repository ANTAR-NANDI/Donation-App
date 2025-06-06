import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../../config";
import { useTranslation } from "react-i18next";
const RegistrationScreen = ({ navigation }: any) => {
  const { t, i18n } = useTranslation();
  // State to store form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({});

  const validateForm = () => {
    if (!name.trim()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Name is required.",
      });
      return false;
    }
    if (!email.trim() || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Enter a Valid Email address.",
      });
      return false;
    }
    if (!phone.trim() || !/^\d{11}$/.test(phone)) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Enter a valid 11-digit phone number.",
      });
      return false;
    }
    if (!password.trim() || password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Password must be at least 6 characters.",
      });
      return false;
    }
    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Password Mismatch",
        text2: "Passwords do not match.",
      });
      return false;
    }
    return true;
  };
  const renderError = (field) => {
    return error?.response?.data?.errors?.[field]?.map((errMsg, index) => (
      <Text key={index} style={styles.errorText}>
        {errMsg}
      </Text>
    ));
  };
  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post(`${BASE_URL}/member/register`, {
        username: name,
        email,
        phone,
        password,
        password_confirmation: confirmPassword,
      });
      // console.log(response.data.user.id);
      await AsyncStorage.setItem("@auth_token", response.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(response.data.user.id));
      try {
        const latest_response = await axios.post(`${BASE_URL}/save-token`, {
          expo_token: await AsyncStorage.getItem("@expoPushToken"),
          user_id: response.data.user.id,
        });
        console.log(latest_response);
      } catch (error) {
        console.error("Error Updating push token:", error.response);
      }
      Toast.show({
        type: "success",
        text1: "Successful",
        text2: "Registered Successfully !",
      });
      setTimeout(() => {
        navigation.replace("App");
      }, 1000);
    } catch (error) {
      setError(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{t("register_form")}</Text>

      <Text style={styles.label}>{t("name")} *</Text>
      <TextInput
        style={styles.input}
        placeholder={t("name_placeholder")}
        placeholderTextColor="#4D2600"
        value={name}
        onChangeText={setName}
      />
      {renderError("username")}

      <Text style={styles.label}>{t("email")} *</Text>
      <TextInput
        style={styles.input}
        placeholder={t("email_placeholder")}
        placeholderTextColor="#4D2600"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {renderError("email")}

      <Text style={styles.label}>{t("phone")} *</Text>
      <TextInput
        style={styles.input}
        placeholder={t("phone_placeholder")}
        placeholderTextColor="#4D2600"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      {renderError("phone")}

      <Text style={styles.label}>{t("password")} *</Text>
      <TextInput
        style={styles.input}
        placeholder={t("password_placeholder")}
        placeholderTextColor="#4D2600"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {renderError("password")}

      <Text style={styles.label}>{t("confirm_password")} *</Text>
      <TextInput
        style={styles.input}
        placeholder={t("confirm_password_placeholder")}
        placeholderTextColor="#4D2600"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {renderError("password")}

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>{t("register")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={styles.backButton}
      >
        <Text style={styles.buttonText}>{t("back")}</Text>
      </TouchableOpacity>

      <Toast />
    </View>
  );
};
const styles = StyleSheet.create({
  errorText: {
    color: "red",
    fontSize: 20,
    marginTop: 2,
  },
  container: {
    flex: 1,
    backgroundColor: "#D5C295",
    padding: 20,
    justifyContent: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#4D2600",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4D2600",
    marginBottom: 5,
  },
  input: {
    borderWidth: 2,
    borderColor: "#4D2600",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 16,
    color: "#4D2600",
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: "#4D2600",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  backButton: {
    backgroundColor: "#4D2600",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
export default RegistrationScreen;
