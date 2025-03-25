import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import axios from 'axios';
import Toast from 'react-native-toast-message';
import BASE_URL from "../../config";

export default function ForgotPassword({ navigation,route }) {
   const { phone } = route.params;
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({});
  const [timeLeft, setTimeLeft] = useState(60); // 2 min 30 sec
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  // Countdown Timer Effect
  useEffect(() => {
    if (timeLeft <= 0) {
         try {
      const response = axios.post(`${BASE_URL}/member/remove_otp`, {
        phone
      });
        
    } catch (error) {
      console.log(error)
      setError(error)
    }

      setIsResendDisabled(false);
      navigation.replace('ForgetPassword');
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time (MM:SS)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const validateForm = () => {
    if (!otp.trim()) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'OTP is required.' });
      return false;
    }
    if (!password.trim() || password.length < 6) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Password must be at least 6 characters.' });
      return false;
    }
    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Password Mismatch', text2: 'Passwords do not match.' });
      return false;
    }
    return true;
  };

  const resetPassword = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post(`${BASE_URL}/member/reset-password`, { otp, password });
    //   console.log(response.data);
      if (response.data.status) {
        Toast.show({ type: 'success', text1: 'Success', text2: response.data.message });
        setTimeout(() => {
        navigation.replace('Login');
         }, 500);
      } else {
        Toast.show({ type: 'error', text1: 'Failed', text2: response.data.message });
      }
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  const resendOtp = async () => {
    if (!isResendDisabled) {
      setIsResendDisabled(true);
      setTimeLeft(60);

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
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/topoban.png")} style={styles.logo} />
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Enter the OTP to reset your password</Text>

      {/* OTP Input */}
      <TextInput style={styles.input} placeholder="Enter OTP" keyboardType="number-pad" value={otp} onChangeText={setOtp} />
            <Text>Reset Password for {phone}</Text>

      {/* Countdown Timer */}
      <Text style={{ color: timeLeft <= 10 ? "red" : "black", marginBottom: 10 }}>
        Resend OTP in {formatTime(timeLeft)}
      </Text>

      {/* Resend OTP Button */}
      <TouchableOpacity style={[styles.resendButton, isResendDisabled && styles.disabledButton]} onPress={resendOtp} disabled={isResendDisabled}>
        <Text style={styles.buttonText}>Resend OTP</Text>
      </TouchableOpacity>

      {/* Password Input */}
      <TextInput style={styles.input} placeholder="Enter Password" secureTextEntry value={password} onChangeText={setPassword} />

      {/* Confirm Password Input */}
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

      {/* Reset Password Button */}
      <TouchableOpacity style={styles.button} onPress={resetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
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
    marginBottom: 10,
  },
  buttonText: {
    color: "#f4e4c3",
    fontSize: 16,
    fontWeight: "bold",
  },
  resendButton: {
    width: "100%",
    backgroundColor: "#d98b5f",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: "#a87b5d",
  },
});

