import React, { useState, useEffect } from 'react';
import {
  View, Image, Button, TextInput, TouchableOpacity,
  Text, StyleSheet, Alert, ActivityIndicator, ScrollView
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../../config';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const IMG_URL = "http://192.168.0.174:8000/images/nids";

const EditDevoteeScreen = ({ route, navigation }: any) => {
  const { id } = route.params;

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [devoteeRelation, setDevoteeRelation] = useState('');
  const [devoteeName, setDevoteeName] = useState('');
  const [devoteeFather, setDevoteeFather] = useState('');
  const [devoteeMother, setDevoteeMother] = useState('');
  const [devoteePresentAddress, setDevoteePresentAddress] = useState('');
  const [devoteePermanentAddress, setDevoteePermanentAddress] = useState('');
  const [devoteeDateofBirth, setDevoteeDateofBirth] = useState('');
  const [devoteeReferenceNumber, setDevoteeReferenceNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [front_image, setFrontImage] = useState(null);
  const [back_image, setBackImage] = useState(null);

  const handleChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formatDate = (date) => date.toISOString().split("T")[0];

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

  useEffect(() => {
    const fetchDevoteeData = async () => {
      try {
        const token = await AsyncStorage.getItem('@auth_token');
        if (!token) return;

        const response = await axios.get(`${BASE_URL}/get_devotee_details/${id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const devoteeData = response.data.devotee;
        setDevoteeRelation(devoteeData.relation);
        setDevoteeName(devoteeData.name);
        setDevoteeFather(devoteeData.fathers_name);
        setDevoteeMother(devoteeData.mothers_name);
        setDevoteePresentAddress(devoteeData.present_address);
        setDevoteePermanentAddress(devoteeData.permanent_address);
        setDevoteeDateofBirth(devoteeData.dob);
        setDate(new Date(devoteeData.dob));
        setDevoteeReferenceNumber(devoteeData.registerd_rf_number);

        if (devoteeData.nid_front_image) {
          setFrontImage({ uri: `${IMG_URL}/${devoteeData.nid_front_image}` });
        }
        if (devoteeData.nid_back_image) {
          setBackImage({ uri: `${IMG_URL}/${devoteeData.nid_back_image}` });
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching devotee data:', error);
        Alert.alert('Error', 'Failed to load devotee data');
        setLoading(false);
      }
    };

    fetchDevoteeData();
  }, [id]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('@auth_token');
      if (!token) return;

      const convertToBase64 = async (image) => {
        if (image?.uri && image.uri.startsWith('file://')) {
          return await FileSystem.readAsStringAsync(image.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
        }
        return null;
      };

      const base64Front = await convertToBase64(front_image);
      const base64Back = await convertToBase64(back_image);

      const response = await axios.post(
        `${BASE_URL}/update_devotee/${id}`,
        {
          name: devoteeName,
          relation: devoteeRelation,
          fathers_name: devoteeFather,
          mothers_name: devoteeMother,
          present_address: devoteePresentAddress,
          permanent_address: devoteePermanentAddress,
          date_of_birth: formatDate(date),
          reference_number: devoteeReferenceNumber,
          nid_front_image: base64Front,
          nid_back_image: base64Back,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status === true) {
        Alert.alert('Success', 'Devotee updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to update devotee');
      }
    } catch (error) {
      console.error('Error updating devotee:', error);
      Alert.alert('Error', 'Failed to update devotee');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const pickerSelectStyles = StyleSheet.create({
    inputAndroid: {
      height: 50,
      paddingLeft: 10,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      marginBottom: 15,
      backgroundColor: '#fff',
      color: '#000',
    },
    inputIOS: {
      height: 50,
      paddingLeft: 10,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      marginBottom: 15,
      backgroundColor: '#fff',
      color: '#000',
    },
    iconContainer: {
      top: 12,
      right: 12,
    },
  });

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Edit Devotee</Text>

        <Text style={styles.label}>Select Relation *</Text>
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            onValueChange={setDevoteeRelation}
            value={devoteeRelation}
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

        <Text style={styles.label}>Name *</Text>
        <TextInput style={styles.input} value={devoteeName} onChangeText={setDevoteeName} placeholder="Enter Name" />

        <Text style={styles.label}>Father's Name *</Text>
        <TextInput style={styles.input} value={devoteeFather} onChangeText={setDevoteeFather} placeholder="Enter Father's Name" />

        <Text style={styles.label}>Mother's Name *</Text>
        <TextInput style={styles.input} value={devoteeMother} onChangeText={setDevoteeMother} placeholder="Enter Mother's Name" />

        <Text style={styles.label}>Present Address *</Text>
        <TextInput style={styles.input} value={devoteePresentAddress} onChangeText={setDevoteePresentAddress} placeholder="Enter Present Address" />

        <Text style={styles.label}>Permanent Address *</Text>
        <TextInput style={styles.input} value={devoteePermanentAddress} onChangeText={setDevoteePermanentAddress} placeholder="Enter Permanent Address" />

        <Text>Date of Birth: {formatDate(date)}</Text>
        <Button title="Select Date of Birth" onPress={() => setShowPicker(true)} />
        {showPicker && <DateTimePicker value={date} mode="date" display="default" onChange={handleChange} />}

        <Text style={styles.label}>Front Image of NID</Text>
        <TouchableOpacity style={styles.registerButton} onPress={pickFrontImage}>
          <Text style={styles.buttonText}>Pick Front Image</Text>
        </TouchableOpacity>
        {front_image && (
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <Image source={{ uri: front_image.uri }} style={{ width: 200, height: 200 }} />
            <TouchableOpacity style={styles.removeButton} onPress={() => setFrontImage(null)}>
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
            <TouchableOpacity style={styles.removeButton} onPress={() => setBackImage(null)}>
              <Text style={styles.removeButtonText}>Remove Back Image</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.label}>Registered Reference Number *</Text>
        <TextInput style={styles.input} value={devoteeReferenceNumber} onChangeText={setDevoteeReferenceNumber} placeholder="Enter Reference Number" />

        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.buttonText}>{loading ? 'Updating...' : 'Update'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 10,
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
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
  updateButton: {
    height: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 30,
  },
});

export default EditDevoteeScreen;
