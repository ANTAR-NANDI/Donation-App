import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import BASE_URL from '@/config';
import { useTranslation } from 'react-i18next';
const DonationScreen = ({ navigation }: any) => {
    const { t, i18n } = useTranslation();
  // State to store form inputs
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setPaymentMethod] = useState(null);

  // Form validation
  const validateForm = () => {
    if (!name.trim()) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Name is required.' });
      return false;
    }
    if (!amount.trim()) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Amount is required.' });
      return false;
    }
    if (!method) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Please select a payment method.' });
      return false;
    }
    return true;
  };

  // Handle registration logic
  const handleRegister = async () => {
    if (!validateForm()) return;
     try {
      
            const response = await axios.post(`${BASE_URL}/donation`, 
              { 
             name,
             amount,
             method, 
             },
              {
                headers: {
                  Authorization: `Bearer ${await AsyncStorage.getItem("@auth_token")}`,
                  "Content-Type": "application/json", // Ensure correct content type
                },
               });
              Toast.show({ type: 'success', text1: 'Success', text2: 'Donation Successful!' });
          navigation.replace('App');

          } catch (error) {
            Toast.show({ type: 'error', text1: 'Validation Error', text2: error.response.data.error });
          }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{t('donation_form')}</Text>

      <Text style={styles.label}>{t('name')} *</Text>
      <TextInput
        style={styles.input}
        placeholder={t('name_placeholder')}
        placeholderTextColor="#4D2600"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>{t('donation_amount')} *</Text>
      <TextInput
        style={styles.input}
        placeholder={t('donation_amount_placeholder')}
        placeholderTextColor="#4D2600"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <Text style={styles.label}>{t('select_payment_method')} *</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(value) => setPaymentMethod(value)}
          items={[
            { label: 'Credit Card', value: 'credit_card' },
            { label: 'PayPal', value: 'paypal' },
            { label: 'Bank Transfer', value: 'bank_transfer' },
          ]}
          style={{
            ...pickerSelectStyles,
            iconContainer: {
              top: 12,
              right: 12,
            },
          }}
          placeholder={{ label: 'Choose a payment method...', value: null }}
          useNativeAndroidPickerStyle={false} // Ensures custom styling on Android
        />
      </View>

      {method && <Text style={styles.selectedText}>Selected: {method}</Text>}

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>{t('donate')}</Text>
      </TouchableOpacity>

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: '#FFF',
  },
  pickerContainer: {
    borderRadius: 25,
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 15,
  },
  selectedText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4D2600',
  },
  registerButton: {
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

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 0, // Removed the border
    borderRadius: 25,
    backgroundColor: '#FFF',
    color: '#4D2600',
    paddingRight: 30, // Prevents text from cutting off
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 0, // Removed the border
    borderRadius: 25,
    backgroundColor: '#FFF',
    color: '#4D2600',
    paddingRight: 30, // Prevents text from cutting off
  },
};

export default DonationScreen;
