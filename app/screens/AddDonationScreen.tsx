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
    <View style={styles.container}>
      {step === 1 && (
        <View>
          <Text>Select Devotee</Text>
          <Picker
            selectedValue={devoteeId}
            onValueChange={(itemValue) => setDevoteeId(itemValue)}
          >
            {donors.map((donor) => (
              <Picker.Item key={donor.id} label={donor.name} value={donor.id} />
            ))}
          </Picker>

          <Text>From Date</Text>
          <Button
            title={fromDate.toDateString()}
            onPress={() => setShowFromPicker(true)}
          />
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

          <Text>To Date</Text>
          <Button
            title={toDate.toDateString()}
            onPress={() => setShowToPicker(true)}
          />
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

          <TextInput
            placeholder="Enter amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <Button title="Next" onPress={() => setStep(2)} />
        </View>
      )}
      {step === 2 && (
        <View>
          <TouchableOpacity onPress={() => handlePaymentSelection("Nagad")}>
            <Image
              source={require("../../assets/images/nagad.jpg")}
              style={styles.image}
            />
            <Text>Nagad</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handlePaymentSelection("Rocket")}>
            <Image
              source={require("../../assets/images/rocket.jpg")}
              style={styles.image}
            />
            <Text>Rocket</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 3 && (
        <ScrollView>
          <Text>Send Money via {paymentMethod}</Text>
          <Text>📱 01824506162</Text>

          <Text>Mobile Number *</Text>
          <TextInput
            placeholder="Enter your mobile number"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="phone-pad"
          />

          <Text>Transaction ID</Text>
          <TextInput
            placeholder="Enter transaction ID"
            value={transactionId}
            onChangeText={setTransactionId}
          />

          <Text>Amount *</Text>
          <TextInput
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

          <TouchableOpacity onPress={pickImage}>
            <Text>Pick Screenshot Image</Text>
          </TouchableOpacity>

          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          )}

          <Button title="Submit" onPress={handleSubmit} />
        </ScrollView>
      )}

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    marginBottom: 15,
  },
  image: {
    width: 80,
    height: 70,
    resizeMode: "contain",
    marginBottom: 5,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#D5C295",
    padding: 20,
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4D2600",
    marginBottom: 5,
  },
  input: {
    borderWidth: 2,
    borderColor: "#4D2600",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 16,
    color: "#4D2600",
    marginBottom: 15,
    backgroundColor: "#FFF",
  },
  pickerContainer: {
    borderRadius: 25,
    backgroundColor: "#FFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: "#4D2600",
    paddingVertical: 12,
    borderRadius: 25,
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
