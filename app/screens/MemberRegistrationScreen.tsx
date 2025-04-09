import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import BASE_URL from "../../config";
import { useTranslation } from 'react-i18next';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
const MemberRegistrationScreen = ({ navigation }: any) => {
  const { t, i18n } = useTranslation();
    const [name, setName] = useState('');
  const [father_name, setFatherName] = useState('');
  const [mother_name, setMotherName] = useState('');
  const [permanent_address, setPermanentAddress] = useState('');
  const [present_address, setPresentAddress] = useState('');
  const [date_of_birth, setDateofBirth] = useState('');
  const [reference_number, setReferenceNumber] = useState('');
    const [relation, setRelation] = useState(null);
  const validateForm = () => {
      if (!father_name.trim()) {
        Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Father Name is required.' });
        return false;
      }
      if (!mother_name.trim()) {
        Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Mother Name is required.' });
        return false;
      }
      if (!permanent_address.trim()) {
        Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Permanent Address is required.' });
        return false;
      }
      if (!date_of_birth.trim()) {
        Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Date of Birth is required.' });
        return false;
      }
      if (!present_address.trim()) {
        Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Present Address is required.' });
        return false;
      }
      
      return true;
    };
  const handleRegister = async () => {
    if (!validateForm()) return
    try {
      
            const response = await axios.post(`${BASE_URL}/add_devotee`, 
              { 
              name,
              relation,
              father_name,
              mother_name,
              present_address,
              permanent_address,
              date_of_birth,
              reference_number
             },
              {
                headers: {
                  Authorization: `Bearer ${await AsyncStorage.getItem("@auth_token")}`,
                  "Content-Type": "application/json",
                },
               });
              Toast.show({ type: 'success', text1: 'Successful', text2: response.data.message });
               setTimeout(() => {
                  navigation.replace('App');
                }, 1000);
          } catch (error) {
            Toast.show({ type: 'error', text1: 'Validation Error', text2: error.response.data.error });
          }
  };
  return (
    <View>
      <ScrollView contentContainerStyle={styles.formContainer}>
              <Text style={styles.formTitle}>{t('register_form')}</Text>

        <Text style={styles.label}>Select Relation *</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(value) => setRelation(value)}
          items={[
            { label: 'Father', value: 'father' },
            { label: 'Mother', value: 'mother' },
            { label: 'Wife', value: 'wife' },
            { label: 'Child', value: 'child' },
            { label: 'Himself', value: 'himself' },
          ]}
          style={{
            ...pickerSelectStyles,
            iconContainer: {
              top: 12,
              right: 12,
            },
          }}
          placeholder={{ label: 'Choose Relation', value: null }}
          useNativeAndroidPickerStyle={false} // Ensures custom styling on Android
        />
      </View>
             <Text style={styles.label}>{t('name')} *</Text>
              <TextInput
                style={styles.input}
                placeholder={t('name_placeholder')}
                placeholderTextColor="#4D2600"
                value={name}
                onChangeText={setName}
              />
              <Text style={styles.label}>{t('father_name')} / Husband's Name*</Text>
              <TextInput
                style={styles.input}
                placeholder={t('father_name_placeholder')}
                placeholderTextColor="#4D2600"
                value={father_name}
                onChangeText={setFatherName}
              />

              <Text style={styles.label}>{t('mother_name')} *</Text>
              <TextInput
                style={styles.input}
                placeholder={t('mother_name_placeholder')}
                placeholderTextColor="#4D2600"
                value={mother_name}
                onChangeText={setMotherName}
              />

                <Text style={styles.label}>{t('present_address')} *</Text>
              <TextInput
                style={styles.input}
                placeholder={t('present_address_placeholder')}
                placeholderTextColor="#4D2600"
                value={present_address}
                onChangeText={setPresentAddress}
              />
              <Text style={styles.label}>{t('permanent_address')} *</Text>
              <TextInput
                style={styles.input}
                placeholder={t('permanent_address_placeholder')}
                placeholderTextColor="#4D2600"
                value={permanent_address}
                onChangeText={setPermanentAddress}
              />
              <Text style={styles.label}>{t('dob')} *</Text>
              <TextInput
                style={styles.input}
                placeholder={t('dob_placeholder')}
                placeholderTextColor="#4D2600"
                value={date_of_birth}
                onChangeText={setDateofBirth}
              />
               <Text style={styles.label}>Registered Reference Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="Registered Reference Number"
                placeholderTextColor="#4D2600"
                value={reference_number}
                onChangeText={setReferenceNumber}
              />

              <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.buttonText}>{t('register')}</Text>
              </TouchableOpacity>
            </ScrollView>
                <Toast />
    </View>
  )
}
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
const styles = StyleSheet.create({
   pickerContainer: {
    borderRadius: 25,
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 15,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#c4a484',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  image: {
    width: '90%', // Adjust width as necessary
    height: 280, // Adjust height as necessary
    borderRadius: 10,
    marginBottom: 20, // Add margin if you want space between image and form
  },
  footerCard: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#fff',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    backgroundColor: '#6200ee',
  },
  footerText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  formContainer: {
    padding:20
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 8,
    borderRadius: 5,
  },
  registerButton: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
});
export default MemberRegistrationScreen;