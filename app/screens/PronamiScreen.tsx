import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import BASE_URL from '@/config';
import { useTranslation } from 'react-i18next';
const PronamiScreen = ({ navigation }: any) => {
    const { t, i18n } = useTranslation();
  // State to store form inputs
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Choose Relation');
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('Choose a Category');
  const [monthly_amount, setMonthlyAmount] = useState('');

  // Form validation
  const validateForm = () => {
    if (!name.trim()) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Name is required.' });
      return false;
    }
    if (!relation.trim()) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Relation is required.' });
      return false;
    }
    if (!amount) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Please Enter an Amount.' });
      return false;
    }
    if (!category) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Please Enter Category.' });
      return false;
    }
    if (!monthly_amount) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Please Enter Monthly Amount.' });
      return false;
    }
    return true;
  };

  // Handle registration logic
  const handleRegister = async () => {
    if (!validateForm()) return;
     try {
      
            const response = await axios.post(`${BASE_URL}/pronami_store`, 
              { 
             name,
             relation,
             amount, 
             category,
             monthly_amount
             },
              {
                headers: {
                  Authorization: `Bearer ${await AsyncStorage.getItem("@auth_token")}`,
                  "Content-Type": "application/json", // Ensure correct content type
                },
               });
              Toast.show({ type: 'success', text1: 'Success', text2: 'আপনার প্রণামী যুক্ত হয়েছে!' });
              navigation.replace('App');

          } catch (error) {
            console.log(error);
            Toast.show({ type: 'error', text1: 'Validation Error', text2: error.response.data.error });
          }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/donation.png')} style={styles.logo} />

      <Text style={styles.label}>{t('donar_name')} *</Text>
      <TextInput
        style={styles.input}
        placeholder={t('donar_name_placeholder')}
        placeholderTextColor="#4D2600"
        value={name}
        onChangeText={setName}
      />
       <Text style={styles.label}>{t('relationship')} *</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(value) => setRelation(value)}
          items={[
            { label: 'Himself', value: 'himself' },
            { label: 'Father', value: 'father' },
            { label: 'Mother', value: 'mother' },
            { label: 'Wife', value: 'wife' },
            { label: 'Child', value: 'child' }
          ]}
          style={{
            ...pickerSelectStyles,
            iconContainer: {
              top: 12,
              right: 12,
            },
          }}
          placeholder={{ label: 'Choose a Relation', value: null }}
          useNativeAndroidPickerStyle={false} // Ensures custom styling on Android
        />
      </View>
      <Text style={styles.label}>{t('amount')} *</Text>
      <TextInput
        style={styles.input}
        placeholder={t('amount_placeholder')}
        placeholderTextColor="#4D2600"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <Text style={styles.label}>{t('category')} *</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(value) => setCategory(value)}
          items={[
            { label: 'Daily', value: 'daily' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
            { label: 'Yearly', value: 'yearly' },
          ]}
          style={{
            ...pickerSelectStyles,
            iconContainer: {
              top: 12,
              right: 12,
            },
          }}
          placeholder={{ label: 'Choose a Category', value: null }}
          useNativeAndroidPickerStyle={false} // Ensures custom styling on Android
        />
      </View>
      <Text style={styles.label}>{t('monthly_amount')} *</Text>
      <TextInput
        style={styles.input}
        placeholder={t('monthly_amount_placeholder')}
        placeholderTextColor="#4D2600"
        value={monthly_amount}
        onChangeText={setMonthlyAmount}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>{t('add')}</Text>
      </TouchableOpacity>

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
    logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
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
    marginBottom: 70,
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

export default PronamiScreen;
