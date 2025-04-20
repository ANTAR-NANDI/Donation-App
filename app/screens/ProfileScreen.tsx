import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import BASE_URL from "../../config";
import { useTranslation } from "react-i18next";

const MemberRegistrationForm = ({ navigation }) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [father_name, setFatherName] = useState("");
  const [mother_name, setMotherName] = useState("");
  const [phone, setPhone] = useState("");
  const [nid, setNid] = useState("");
  const [email, setEmail] = useState("");
  const [occupation, setOccupation] = useState("");
  const [nationality, setNationality] = useState("");
  const [blood, setBlood] = useState("");
  const [present_address, setPresentAddress] = useState("");
  const [permanent_address, setPermanentAddress] = useState("");
  const [user, setUser] = useState(null);

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

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

      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.username || "");
      setFatherName(user.fathers_name || "");
      setMotherName(user.mothers_name || "");
      setPhone(user.phone || "");
      setNid(user.nid_number || "");
      setEmail(user.email || "");
      setOccupation(user.occupation || "");
      setNationality(user.nationality || "");
      setBlood(user.blood_group || "");
      setPresentAddress(user.present_address || "");
      setPermanentAddress(user.permanent_address || "");

      if (user.dob) {
        setDate(new Date(user.dob));
      }
    }
  }, [user]);

  const validateForm = () => {
    if (!name.trim()) {
      Toast.show({ type: "error", text1: "Validation Error", text2: "Name is required." });
      return false;
    }
    if (!father_name.trim()) {
      Toast.show({ type: "error", text1: "Validation Error", text2: "Father Name is required." });
      return false;
    }
    if (!mother_name.trim()) {
      Toast.show({ type: "error", text1: "Validation Error", text2: "Mother Name is required." });
      return false;
    }
    if (!permanent_address.trim()) {
      Toast.show({ type: "error", text1: "Validation Error", text2: "Permanent Address is required." });
      return false;
    }
    if (!present_address.trim()) {
      Toast.show({ type: "error", text1: "Validation Error", text2: "Present Address is required." });
      return false;
    }
    if (!date) {
      Toast.show({ type: "error", text1: "Validation Error", text2: "Date of Birth is required." });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const response = await axios.post(
        `${BASE_URL}/update_profile`,
        {
          name,
          father_name,
          mother_name,
          phone,
          nid,
          email,
          occupation,
          nationality,
          date_of_birth: formatDate(date),
          blood,
          present_address,
          permanent_address,
        },
        {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem("@auth_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      fetchUserData();
      navigation.replace("App");
      Toast.show({ type: "success", text1: "Successful", text2: "Data Updated Successfully!" });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Update Error",
        text2: error.response?.data?.error || "An error occurred",
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Member's Profile</Text>

      <TextInput style={styles.input} placeholder={t("name_placeholder")} value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder={t("father_name_placeholder")} value={father_name} onChangeText={setFatherName} />
      <TextInput style={styles.input} placeholder={t("mother_name_placeholder")} value={mother_name} onChangeText={setMotherName} />
      <TextInput style={styles.input} placeholder={t("phone_placeholder")} keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
      <TextInput style={styles.input} placeholder={t("nid_placeholder")} keyboardType="numeric" value={nid} onChangeText={setNid} />
      <TextInput style={styles.input} placeholder={t("email_placeholder")} keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder={t("occupation_placeholder")} value={occupation} onChangeText={setOccupation} />
      <TextInput style={styles.input} placeholder={t("nationality_placeholder")} value={nationality} onChangeText={setNationality} />

      <Text>Date of Birth: {formatDate(date)}</Text>
      <Button title="Select Date of Birth" onPress={() => setShowPicker(true)} />

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}

      <TextInput style={styles.input} placeholder={t("blood_placeholder")} value={blood} onChangeText={setBlood} />
      <TextInput style={styles.input} placeholder={t("present_address_placeholder")} value={present_address} onChangeText={setPresentAddress} />
      <TextInput style={styles.input} placeholder={t("permanent_address_placeholder")} value={permanent_address} onChangeText={setPermanentAddress} />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{t("update_data")}</Text>
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
    marginTop:10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginBottom: 12,
    justifyContent: "center",
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
});

export default MemberRegistrationForm;
