import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
  ScrollView,
  Image,
} from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from "react-native-picker-select";
import { Picker } from "@react-native-picker/picker";
import BASE_URL from "@/config";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";
import DateTimePicker from "@react-native-community/datetimepicker";
const DonationScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [donors, setDonors] = useState([]);
  const [devoteeId, setDevoteeId] = useState(null);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [amount, setAmount] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [imageUri, setImageUri] = useState(null);

  // Date picker states
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  // Fetch donors when relation changes
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const token = await AsyncStorage.getItem("@auth_token");

        const response = await axios.get(`${BASE_URL}/get_donors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const allDevotees = response.data?.devotees || [];

        setDonors(allDevotees);
        console.log(donors);
      } catch (error) {
        console.log("Error fetching donors:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Could not fetch donor list.",
        });
      }
    };

    fetchDonors();
  }, []);
  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("@auth_token");
      const formData = new FormData();

      formData.append("devotee_id", devoteeId);
      formData.append("from_date", fromDate.toISOString().split("T")[0]);
      formData.append("to_date", toDate.toISOString().split("T")[0]);
      formData.append("amount", amount);
      formData.append("payment_method", paymentMethod);
      formData.append("mobile_number", mobileNumber);
      formData.append("transaction_id", transactionId);

      if (imageUri) {
        formData.append("screenshot", {
          uri: imageUri,
          name: "screenshot.jpg",
          type: "image/jpeg",
        });
      }
      console.log(formData);

      await axios.post(`${BASE_URL}/pronami_store`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Donation submitted.",
      });
      resetForm();
    } catch (error) {
      console.error("Error submitting:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to submit donation.",
      });
    }
  };

  const resetForm = () => {
    setStep(1);
    setDevoteeId(null);
    setFromDate(new Date());
    setToDate(new Date());
    setAmount("");
    setPaymentMethod("");
    setMobileNumber("");
    setTransactionId("");
    setImageUri(null);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };
  const handlePaymentSelection = (method) => {
    setPaymentMethod(method);
    setStep(3);
  };

  return (
    <ScrollView style={styles.container}>
      {step === 1 && (
        <View style={styles.stepContainer}>
          <Text style={styles.sectionTitle}>Select Devotee</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={devoteeId}
              onValueChange={(itemValue) => setDevoteeId(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="-- Select Devotee --" value={null} />
              {donors.map((donor) => (
                <Picker.Item
                  key={donor.id}
                  label={donor.name}
                  value={donor.id}
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>From Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowFromPicker(true)}
          >
            <Text style={styles.dateText}>{fromDate.toDateString()}</Text>
          </TouchableOpacity>
          {showFromPicker && (
            <DateTimePicker
              value={fromDate}
              mode="date"
              onChange={(e, selectedDate) => {
                setShowFromPicker(false);
                if (selectedDate) setFromDate(selectedDate);
              }}
            />
          )}

          <Text style={styles.label}>To Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowToPicker(true)}
          >
            <Text style={styles.dateText}>{toDate.toDateString()}</Text>
          </TouchableOpacity>
          {showToPicker && (
            <DateTimePicker
              value={toDate}
              mode="date"
              onChange={(e, selectedDate) => {
                setShowToPicker(false);
                if (selectedDate) setToDate(selectedDate);
              }}
            />
          )}

          <Text style={styles.label}>Donation Amount (৳)</Text>
          <TextInput
            placeholder="Enter amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            style={styles.input}
          />

          <TouchableOpacity style={styles.button} onPress={() => setStep(2)}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <View style={styles.stepContainer}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>

          <TouchableOpacity
            style={styles.paymentOption}
            onPress={() => handlePaymentSelection("Nagad")}
          >
            <Image
              source={require("../../assets/images/nagad.jpg")}
              style={styles.image}
            />
            <Text style={styles.paymentText}>Nagad</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.paymentOption}
            onPress={() => handlePaymentSelection("Rocket")}
          >
            <Image
              source={require("../../assets/images/rocket.jpg")}
              style={styles.image}
            />
            <Text style={styles.paymentText}>Rocket</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 3 && (
        <View style={styles.stepContainer}>
          <Text style={styles.sectionTitle}>
            Send Money via {paymentMethod}
          </Text>
          <Text style={styles.subText}>📱 01824506162</Text>

          <Text style={styles.label}>Mobile Number *</Text>
          <TextInput
            placeholder="Enter your mobile number"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="phone-pad"
            style={styles.input}
          />

          <Text style={styles.label}>Transaction ID *</Text>
          <TextInput
            placeholder="Enter transaction ID"
            value={transactionId}
            onChangeText={setTransactionId}
            style={styles.input}
          />

          <Text style={styles.label}>Amount *</Text>
          <TextInput
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
          />

          <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
            <Text style={styles.uploadText}>📷 Upload Screenshot</Text>
          </TouchableOpacity>

          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          )}

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF6EC",
    padding: 20,
  },
  stepContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#4D2600",
  },
  subText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4D2600",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#B2875E",
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#FFF",
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1.5,
    borderColor: "#B2875E",
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: "#FFF",
  },
  picker: {
    padding: 10,
    color: "#333",
  },
  dateButton: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#B2875E",
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  image: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    borderRadius: 10,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#B2875E",
    borderRadius: 10,
    backgroundColor: "#FFF",
    marginBottom: 15,
  },
  paymentText: {
    fontSize: 18,
    color: "#4D2600",
  },
  uploadButton: {
    backgroundColor: "#FFD699",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4D2600",
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    marginBottom: 15,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#4D2600",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: "#FFF",
    color: "#4D2600",
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: "#FFF",
    color: "#4D2600",
    paddingRight: 30,
  },
};

export default DonationScreen;
