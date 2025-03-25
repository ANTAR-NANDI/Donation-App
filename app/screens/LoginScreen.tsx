// LoginScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button,  TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from "../../config";
const LoginScreen = ({ navigation }: any) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({});
  const validateForm = () => {
    if (!phone.trim()) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Enter Your Phone Number.' });
      return false;
    }

    if (!password.trim()) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Password must be at least 6 characters.' });
      return false;
    }

    return true;
  };

  const renderError = (field) => {
      return error?.response?.data?.errors?.[field]?.map((errMsg, index) => (
        <Text key={index} style={styles.errorText}>{errMsg}</Text>
      ));
    };

  const handleLogin = async () => {
    console.log(BASE_URL);
    if (!validateForm()) return;

    try {
      const response = await axios.post(`${BASE_URL}/member/login`, {
        phone,
        password,
      });
      console.log(response.data)
      if(response.data.status == false)
      {
        Toast.show({ type: 'error', text1: 'Failed', text2: 'Your account is inactive. Contact support !' });
      }
      else{
          const { token, user } = response.data;
          await AsyncStorage.setItem('@auth_token', token);
          await AsyncStorage.setItem('@user', JSON.stringify(user.id));
                try {
                  const latest_response = await axios.post(`${BASE_URL}/save-token`, {
                            expo_token:await AsyncStorage.getItem('@expoPushToken'),
                            user_id: response.data.user.user
                        });
                  } 
                  catch (error) {
                    console.error('Error Updating push token:', error.response);
                }
                Toast.show({ type: 'success', text1: 'Successful', text2: 'Login Successfully !' });
                setTimeout(() => {
                  navigation.replace('App');
                }, 400);
      }
      
    } catch (error) {
      console.log(error)
      setError(error)
    }
  };

  return (
     <View style={styles.container}>
      <Text style={styles.heading}>Sign In</Text>

      <Text style={styles.label}>Phone Number *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Your Phone Number"
        placeholderTextColor="#4D2600"
        value={phone}
        onChangeText={setPhone}
      />
      {renderError('phone')}

      <Text style={styles.label}>Password *</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#4D2600"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {renderError('password')}

      <TouchableOpacity style={styles.registerButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.backButton}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')} style={styles.forgotPasswordButton}>
  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
</TouchableOpacity>

      <Toast />
    </View>
  );
};
const styles = StyleSheet.create({
  forgotPasswordButton: {
  marginTop: 10,
  alignItems: "center",
},

forgotPasswordText: {
  color: "blue",
  textDecorationLine: "underline",
  fontSize: 16,
},
  errorText: {
    color: 'red',
    fontSize: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#D5C295',
    padding: 20,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#4D2600',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4D2600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 2,
    borderColor: '#4D2600',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 16,
    color: '#4D2600',
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: '#4D2600',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  backButton: {
    backgroundColor: '#4D2600',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
