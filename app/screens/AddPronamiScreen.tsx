import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import BASE_URL from '@/config';
import { useTranslation } from 'react-i18next';

const PronamiScreen = ({ navigation }: any) => {
  const { t } = useTranslation();

  // Form states
  const [relation, setRelation] = useState('');
  const [donors, setDonors] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState('');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  // Fetch donors when relation changes
  const fetchDonorsByRelation = async (relationValue) => {
    try {
      const token = await AsyncStorage.getItem("@auth_token");
      const response = await axios.get(`${BASE_URL}/get_donors_by_relation/${relationValue}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const donorList = Array.isArray(response.data?.devotees?.[relationValue])
      ? response.data.devotees[relationValue]
      : [];

    setDonors(donorList);
    } catch (error) {
      console.log('Error fetching donors:', error);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Could not fetch donor list.' });
    }
  };

  // Form validation
  const validateForm = () => {
    if (!relation) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Relation is required.' });
      return false;
    }
    if (!selectedDonor) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Donor is required.' });
      return false;
    } 
    if (!month) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Please select a month.' });
      return false;
    }
    if (!year) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Please select a year.' });
      return false;
    }
    if (!amount) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Please enter an amount.' });
      return false;
    }
    
    
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const token = await AsyncStorage.getItem("@auth_token");
      await axios.post(`${BASE_URL}/pronami_store`, {
        devotee_name: selectedDonor,
        relation,
        amount,
        month,
        year,

      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      Toast.show({ type: 'success', text1: 'Success', text2: 'আপনার প্রণামী যুক্ত হয়েছে!' });
      navigation.replace('App');
    } catch (error) {
      console.log(error);
      Toast.show({ type: 'error', text1: 'Error', text2: error.response?.data?.error || 'Something went wrong.' });
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/donation.png')} style={styles.logo} />

      {/* Relation Picker */}
      <Text style={styles.label}>{t('relationship')} *</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(value) => {
            setRelation(value);
            fetchDonorsByRelation(value);
          }}
          items={[
            { label: 'Himself', value: 'himself' },
            { label: 'Father', value: 'father' },
            { label: 'Mother', value: 'mother' },
            { label: 'Wife', value: 'wife' },
            { label: 'Child', value: 'child' }
          ]}
          style={pickerSelectStyles}
          placeholder={{ label: 'Choose Relation', value: null }}
          useNativeAndroidPickerStyle={false}
        />
      </View>

      {/* Donor Picker */}
      <Text style={styles.label}>{t('donar_name')} *</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(value) => setSelectedDonor(value)}
          items={donors.map((donor) => ({
            label: donor.name,
            value: donor.id
          }))}
          style={pickerSelectStyles}
          placeholder={{ label: 'Choose Donor', value: null }}
          useNativeAndroidPickerStyle={false}
        />
      </View>

      {/* Month Picker */}
      <Text style={styles.label}>Month *</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(value) => setMonth(value)}
          items={[
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ].map((month) => ({ label: month, value: month.toLowerCase() }))}
          style={pickerSelectStyles}
          placeholder={{ label: 'Choose Month', value: null }}
          useNativeAndroidPickerStyle={false}
        />
      </View>

      {/* Year Picker */}
      <Text style={styles.label}>Year *</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(value) => setYear(value)}
          items={[
            2028, 2027, 2026, 2025, 2024, 2023, 2022, 2021, 2020
          ].map((yr) => ({ label: yr.toString(), value: yr.toString() }))}
          style={pickerSelectStyles}
          placeholder={{ label: 'Choose Year', value: null }}
          useNativeAndroidPickerStyle={false}
        />
      </View>

      {/* Amount */}
      <Text style={styles.label}>{t('amount')} *</Text>
      <TextInput
        style={styles.input}
        placeholder={t('amount_placeholder')}
        placeholderTextColor="#4D2600"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      {/* Submit */}
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
    borderRadius: 25,
    backgroundColor: '#FFF',
    color: '#4D2600',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: '#FFF',
    color: '#4D2600',
    paddingRight: 30,
  },
};

export default PronamiScreen;
