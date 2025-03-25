import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import axios from 'axios';
import Toast from 'react-native-toast-message';
import BASE_URL from "../../config";
export default function ForgotPassword({ navigation }) {
  const [phone, setPhone] = useState("");
 const [error, setError] = useState({});
 const validateForm = () => {
     if (!phone.trim()) {
       Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Enter Your Phone Number.' });
       return false;
     }
     return true;
   };
  const renderError = (field) => {
        return error?.response?.data?.errors?.[field]?.map((errMsg, index) => (
          <Text key={index} style={styles.errorText}>{errMsg}</Text>
        ));
      };
  const sendOTP = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post(`${BASE_URL}/member/send_otp`, {
        phone
      });
      if(response.data.status)
      {
         Toast.show({ type: 'success', text1: 'Successful', text2: 'OTP has been sent !' });
        setTimeout(() => {
            // navigation.replace('ResetPassword');
            navigation.replace('ResetPassword', { phone: phone });
        }, 500);
      }
        
    } catch (error) {
      console.log(error)
      setError(error)
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require("../../assets/images/topoban.png")} style={styles.logo} />

      {/* Title */}
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>We will send a link to reset your password</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Mobile Number"
        placeholderTextColor="#5a3d31"
        value={phone}
        onChangeText={setPhone}
      />
      {renderError('phone')}

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={sendOTP}>
        <Text style={styles.buttonText}>Get OTP</Text>
      </TouchableOpacity>

      {/* Sign In Link */}
      <TouchableOpacity  onPress={() => navigation.navigate("Login")}>
        <Text style={styles.signInText}>Sign in</Text>
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
    marginBottom: 15,
  },
  button: {
    width: "100%",
    backgroundColor: "#5a3d31",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
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
