import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Button,
  ScrollView,
} from 'react-native';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import BASE_URL from '../../config';
import { useTranslation } from 'react-i18next';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

const imageToBase64 = async (uri) => {
  const manipResult = await ImageManipulator.manipulateAsync(uri, [], {
    base64: true,
  });
  return manipResult.base64;
};

const MemberRegistrationScreen = ({ navigation }: any) => {
  const { t } = useTranslation();

  const [name, setName] = useState('abc');
  const [father_name, setFatherName] = useState('def');
  const [mother_name, setMotherName] = useState('ghi');
  const [permanent_address, setPermanentAddress] = useState('kjl');
  const [present_address, setPresentAddress] = useState('mno');
  const [reference_number, setReferenceNumber] = useState('dsd');
  const [relation, setRelation] = useState(null);
  const [front_image, setFrontImage] = useState(null);
  const [back_image, setBackImage] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const validateForm = () => {
    if (
      !father_name.trim() ||
      !mother_name.trim() ||
      !permanent_address.trim() ||
      !present_address.trim()
    ) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill all required fields.',
      });
      return false;
    }
    return true;
  };

  const pickFrontImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFrontImage(result.assets[0]);
    }
  };

  const pickBackImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setBackImage(result.assets[0]);
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const token = await AsyncStorage.getItem('@auth_token');

      let frontBase64 = null;
      let backBase64 = null;

      if (front_image?.uri) {
        frontBase64 = await imageToBase64(front_image.uri);
      }

      if (back_image?.uri) {
        backBase64 = await imageToBase64(back_image.uri);
      }

      const payload = {
        name,
        relation,
        father_name,
        mother_name,
        present_address,
        permanent_address,
        date_of_birth: formatDate(date),
        reference_number,
        front_image: frontBase64,
        back_image: backBase64,
      };

      const response = await axios.post(`${BASE_URL}/add_devotee`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: response.data.message,
      });

      setTimeout(() => {
        navigation.replace('App');
      }, 1000);
    } catch (error) {
      console.log('AXIOS ERROR:', JSON.stringify(error, null, 2));

      Toast.show({
        type: 'error',
        text1: 'Upload failed',
        text2:
          error?.response?.data?.error || error.message || 'Unknown error occurred',
      });
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
            style={pickerSelectStyles}
            placeholder={{ label: 'Choose Relation', value: null }}
            useNativeAndroidPickerStyle={false}
          />
        </View>

        <Text style={styles.label}>{t('name')} *</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Father / Husband's Name *</Text>
        <TextInput
          style={styles.input}
          value={father_name}
          onChangeText={setFatherName}
        />

        <Text style={styles.label}>Mother's Name *</Text>
        <TextInput
          style={styles.input}
          value={mother_name}
          onChangeText={setMotherName}
        />

        <Text style={styles.label}>Present Address *</Text>
        <TextInput
          style={styles.input}
          value={present_address}
          onChangeText={setPresentAddress}
        />

        <Text style={styles.label}>Permanent Address *</Text>
        <TextInput
          style={styles.input}
          value={permanent_address}
          onChangeText={setPermanentAddress}
        />

        <Text style={styles.label}>Date of Birth: {formatDate(date)}</Text>
        <Button title="Select Date of Birth" onPress={() => setShowPicker(true)} />
        {showPicker && (
          <DateTimePicker value={date} mode="date" display="default" onChange={handleChange} />
        )}

        <Text style={styles.label}>Front Image of NID</Text>
        <TouchableOpacity style={styles.registerButton} onPress={pickFrontImage}>
          <Text style={styles.buttonText}>Pick Front Image</Text>
        </TouchableOpacity>
        {front_image && (
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <Image source={{ uri: front_image.uri }} style={{ width: 200, height: 200 }} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => setFrontImage(null)}
            >
              <Text style={styles.removeButtonText}>Remove Front Image</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.label}>Back Image of NID</Text>
        <TouchableOpacity style={styles.registerButton} onPress={pickBackImage}>
          <Text style={styles.buttonText}>Pick Back Image</Text>
        </TouchableOpacity>
        {back_image && (
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <Image source={{ uri: back_image.uri }} style={{ width: 200, height: 200 }} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => setBackImage(null)}
            >
              <Text style={styles.removeButtonText}>Remove Back Image</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.label}>Registered Reference Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="Reference Number"
          value={reference_number}
          onChangeText={setReferenceNumber}
        />

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.buttonText}>{t('register')}</Text>
        </TouchableOpacity>
      </ScrollView>
      <Toast />
    </View>
  );
};

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

const styles = StyleSheet.create({
  pickerContainer: {
    borderRadius: 25,
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 15,
  },
  formContainer: {
    padding: 20,
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
    marginTop: 10,
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
  removeButton: {
    marginTop: 10,
    backgroundColor: '#b00020',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default MemberRegistrationScreen;
