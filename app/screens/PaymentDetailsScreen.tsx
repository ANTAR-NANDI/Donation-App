import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

const PaymentDetailsScreen = ({ route, navigation }: any) => {
  const { method } = route.params;

  const [mobileNumber, setMobileNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [amount, setAmount] = useState("");
  const [imageUri, setImageUri] = useState("");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!mobileNumber || !transactionId || !amount || !imageUri) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill all fields and attach screenshot.",
      });
      return;
    }

    // Perform your API request here
    Toast.show({
      type: "success",
      text1: "Submitted",
      text2: "Your payment info has been sent.",
    });
    navigation.replace("App"); // Adjust this as needed
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.instruction}>
          Send Money via {method} to the Following Number:
          {"\n\n"}📱 <Text style={styles.bold}>01824506162</Text>
          {"\n"}📝 Type: Send Money
          {"\n\n"}Once payment is done, please send a screenshot and your name
          to confirm.
          {"\n\n"}Thank you for your support! 🙏
        </Text>

        <Text style={styles.label}>Mobile Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your mobile number"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Transaction ID </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter transaction ID"
          value={transactionId}
          onChangeText={setTransactionId}
        />

        <Text style={styles.label}>Amount *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text style={styles.imagePickerText}>Pick Screenshot Image</Text>
        </TouchableOpacity>

        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : null}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>

        <Toast />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D5C295",
    padding: 20,
  },
  instruction: {
    backgroundColor: "#FBEED3",
    padding: 15,
    borderRadius: 15,
    color: "#4D2600",
    marginBottom: 20,
    fontSize: 14,
  },
  bold: {
    fontWeight: "bold",
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
    backgroundColor: "#FFF",
    marginBottom: 15,
  },
  imagePicker: {
    backgroundColor: "#4D2600",
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
  },
  imagePickerText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: "#4D2600",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  submitText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default PaymentDetailsScreen;
