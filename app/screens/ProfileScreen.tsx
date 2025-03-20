import React, { useState, useEffect,useCallback } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Alert, Image , ScrollView, StyleSheet 
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Toast from 'react-native-toast-message';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from "../../config";
const MemberRegistrationForm = ({ navigation }) => {
  const [name, setName] = useState("");
  const [father_name, setFatherName] = useState("");
  const [mother_name, setMotherName] = useState("");
  const [phone, setPhone] = useState("");
  const [nid, setNid] = useState("");
  const [email, setEmail] = useState("");
  const [occupation, setOccupation] = useState("");
  const [nationality, setNationality] = useState("");
  const [date_of_birth, setDateOfBirth] = useState("");
  const [blood, setBlood] = useState("");
  const [present_address, setPresentAddress] = useState("");
  const [permanent_address, setPermanentAddress] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);


  useFocusEffect(
        useCallback(() => {
            fetchUserData();
        }, [])
    );


const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("@auth_token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get(`${BASE_URL}/user`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response)

        setUser(response.data); // Update state with user data
      } catch (error) {
        console.error("Error fetching user data:", error.response?.data || error.message);
      }
    };
  useEffect(() => {
    // Once user data is fetched, set the fields' state
    if (user) {
      setName(user.username || "");
      setFatherName(user.fathers_name || "");
      setMotherName(user.mothers_name || "");
      setPhone(user.phone || "");
      setNid(user.nid_number || "");
      setEmail(user.email || "");
      setOccupation(user.occupation || "");
      setNationality(user.nationality || "");
      setDateOfBirth(user.dob || "");
      setBlood(user.blood_group || "");
      setPresentAddress(user.present_address || "");
      setPermanentAddress(user.permanent_address || "");
    }
  }, [user]);

  // Validation the Form Logic
  const validateForm = () => {
    if (!name.trim()) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Name is required.' });
      return false;
    }
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

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      
            const response = await axios.post(`${BASE_URL}/update_profile`, 
              { 
              name,
              father_name,
              mother_name,
              phone,
              nid,
              email,
              occupation,
              nationality,
              date_of_birth,
              blood,
              present_address,
              permanent_address,
             },
              {
                headers: {
                  Authorization: `Bearer ${await AsyncStorage.getItem("@auth_token")}`,
                  "Content-Type": "application/json", // Ensure correct content type
                },
               });
               console.log(response)
               fetchUserData();
               navigation.replace('App');
              Toast.show({ type: 'success', text1: 'Successful', text2: 'Data Updated Successfully !' });

          } catch (error) {
                console.log(error)
            Toast.show({ type: 'error', text1: 'Validation Error', text2: error.response.data.error });
          }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Member's Profile</Text>

      <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Father's Name" value={father_name} onChangeText={setFatherName} />
      <TextInput style={styles.input} placeholder="Mother's Name" value={mother_name} onChangeText={setMotherName} />
      <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
      <TextInput style={styles.input} placeholder="NID Number" keyboardType="numeric" value={nid} onChangeText={setNid} />
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Occupation" value={occupation} onChangeText={setOccupation} />
      <TextInput style={styles.input} placeholder="Nationality" value={nationality} onChangeText={setNationality} />
      <TextInput style={styles.input} placeholder="Date of Birth (YYYY-MM-DD)" value={date_of_birth} onChangeText={setDateOfBirth} />
      <TextInput style={styles.input} placeholder="Blood Group" value={blood} onChangeText={setBlood} />
      <TextInput style={styles.input} placeholder="Present Address" value={present_address} onChangeText={setPresentAddress} />
      <TextInput style={styles.input} placeholder="Permanent Address" value={permanent_address} onChangeText={setPermanentAddress} />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Update Data</Text>
      </TouchableOpacity>
      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  imageText: {
    fontSize: 16,
    color: "#007bff",
  },
});

export default MemberRegistrationForm;
