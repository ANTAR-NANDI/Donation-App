import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import BASE_URL from "../../config";
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function MemberRegistrationScreen() {
  const { t, i18n } = useTranslation();
  const [father_name, setFatherName] = useState('');
  const [mother_name, setMotherName] = useState('');
  const [permanent_address, setPermanentAddress] = useState('');
  const [present_address, setPresentAddress] = useState('');
  const [date_of_birth, setDateofBirth] = useState('');
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
      
            const response = await axios.post(`${BASE_URL}/update_profile`, 
              { 
              father_name,
              mother_name,
              present_address,
              permanent_address,
              date_of_birth
             },
              {
                headers: {
                  Authorization: `Bearer ${await AsyncStorage.getItem("@auth_token")}`,
                  "Content-Type": "application/json", // Ensure correct content type
                },
               });
               console.log(response);
              Toast.show({ type: 'success', text1: 'Successful', text2: 'Data Updated Successfully !' });

          } catch (error) {
            Toast.show({ type: 'error', text1: 'Validation Error', text2: error.response.data.error });
          }
  };
  return (
    <View>
      <ScrollView contentContainerStyle={styles.formContainer}>
              <Text style={styles.formTitle}>{t('register_form')}</Text>

              <Text style={styles.label}>{t('father_name')} *</Text>
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

              <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.buttonText}>{t('register')}</Text>
              </TouchableOpacity>
            </ScrollView>
                <Toast />
    </View>
  )
}
const styles = StyleSheet.create({
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