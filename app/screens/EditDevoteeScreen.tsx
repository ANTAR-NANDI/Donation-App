import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator,ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../../config';
import RNPickerSelect from 'react-native-picker-select';

const EditDevoteeScreen = ({ route, navigation }: any) => {
  const { id } = route.params;  // Get the id from route params

  const [devoteeRelation, setDevoteeRelation] = useState('');
  const [devoteeName, setDevoteeName] = useState('');
  const [devoteeFather, setDevoteeFather] = useState('');
  const [devoteeMother, setDevoteeMother] = useState('');
  const [devoteePresentAddress, setDevoteePresentAddress] = useState('');
  const [devoteePermanentAddress, setDevoteePermanentAddress] = useState('');
  const [devoteeDateofBirth, setDevoteeDateofBirth] = useState('');
  const [devoteeReferenceNumber, setDevoteeReferenceNumber] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch devotee data when the component mounts
  useEffect(() => {
    const fetchDevoteeData = async () => {
      try {
        const token = await AsyncStorage.getItem('@auth_token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await axios.get(`${BASE_URL}/get_devotee_details/${id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        const devoteeData = response.data.devotee;
        setDevoteeRelation(devoteeData.relation);
        setDevoteeName(devoteeData.name);
        setDevoteeFather(devoteeData.fathers_name);
        setDevoteeMother(devoteeData.mothers_name);
        setDevoteePresentAddress(devoteeData.present_address);
        setDevoteePermanentAddress(devoteeData.permanent_address);
        setDevoteeDateofBirth(devoteeData.dob);
        setDevoteeReferenceNumber(devoteeData.registerd_rf_number);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching devotee data:', error);
        setLoading(false);
        Alert.alert('Error', 'Failed to load devotee data');
      }
    };

    fetchDevoteeData();
  }, [id]);

  const handleUpdate = async () => {
    setLoading(true);  // Show loading state while updating
    try {
      const token = await AsyncStorage.getItem('@auth_token');
      if (!token) {
        console.error('No token found');
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/update_devotee/${id}`,
        {
          name: devoteeName,
          relation: devoteeRelation,
          fathers_name: devoteeFather,
          mothers_name: devoteeMother,
          present_address: devoteePresentAddress,
          permanent_address: devoteePermanentAddress,
          date_of_birth: devoteeDateofBirth,
          reference_number: devoteeReferenceNumber,
        },
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
       console.log(response);
      if (response.data.status === true) {
        Alert.alert('Success', 'Devotee updated successfully');
        navigation.goBack();  // Navigate back to the previous screen
      } else {
        Alert.alert('Error', 'Failed to update devotee');
      }
    } catch (error) {
      console.error('Error updating devotee:', error);
      Alert.alert('Error', 'Failed to update devotee');
    } finally {
      setLoading(false);  // Hide loading state after operation is completed
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Define pickerSelectStyles for the RNPickerSelect component
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
          onValueChange={(value) => setDevoteeRelation(value)}
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
          useNativeAndroidPickerStyle={false} // Ensures custom styling on Android
        />
      </View>

      <Text style={styles.label}>Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={devoteeName}
        onChangeText={setDevoteeName}
      />

      <Text style={styles.label}>Father's Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Father's Name"
        value={devoteeFather}
        onChangeText={setDevoteeFather}
      />

      <Text style={styles.label}>Mother's Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Mother's Name"
        value={devoteeMother}
        onChangeText={setDevoteeMother}
      />

      <Text style={styles.label}>Present Address *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Present Address"
        value={devoteePresentAddress}
        onChangeText={setDevoteePresentAddress}
      />

      <Text style={styles.label}>Permanent Address *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Permanent Address"
        value={devoteePermanentAddress}
        onChangeText={setDevoteePermanentAddress}
      />

      <Text style={styles.label}>Date of Birth *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Date of Birth"
        value={devoteeDateofBirth}
        onChangeText={setDevoteeDateofBirth}
      />

      <Text style={styles.label}>Registered Reference Number *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Reference Number"
        value={devoteeReferenceNumber}
        onChangeText={setDevoteeReferenceNumber}
      />

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.buttonText}>{loading ? 'Updating...' : 'Update'}</Text>
      </TouchableOpacity>
    </View>
   </ScrollView>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    height: 50,                // Defines the height of the picker container
    borderColor: '#ddd',       // Light border color for the container
    borderWidth: 1,            // Border width to create a visible boundary
    borderRadius: 5,           // Rounded corners for the container
    marginBottom: 15,          // Spacing between the picker container and other form elements
    backgroundColor: '#fff',   // White background for the container
    justifyContent: 'center',  // Centers the picker vertically
    paddingHorizontal: 10,     // Padding on the left and right inside the container
  },

  label: {
    fontSize: 16,           // Adjust font size as needed
    fontWeight: '600',       // Gives the label a semi-bold weight
    color: '#333',          // Dark grey color for the text
    marginBottom: 8,        // Spacing between the label and the input
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
  button: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  updateButton: {
    height: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});

export default EditDevoteeScreen;
