import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router"; // or use navigation.navigate if using react-navigation
import { useTranslation } from "react-i18next";

const DonationScreen = ({ navigation }: any) => {
  const { t } = useTranslation();

  const handlePaymentSelection = (method: string) => {
    // Navigate to the next screen with selected method
    navigation.navigate("DonationDetail", { method }); // adjust the screen name
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t("select_payment_method")}</Text>

      <View style={styles.paymentContainer}>
        <TouchableOpacity
          style={styles.paymentBox}
          onPress={() => handlePaymentSelection("nagad")}
        >
          <Image
            source={require("../../assets/images/nagad.jpg")}
            style={styles.image}
          />
          <Text style={styles.paymentText}>Nagad</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.paymentBox}
          onPress={() => handlePaymentSelection("rocket")}
        >
          <Image
            source={require("../../assets/images/rocket.jpg")}
            style={styles.image}
          />
          <Text style={styles.paymentText}>Rocket</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 15,
    textAlign: "center",
  },
  paymentContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  paymentBox: {
    backgroundColor: "#C7A977",
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    width: 150,
    height: 100,
    justifyContent: "center",
  },
  image: {
    width: 80,
    height: 70,
    resizeMode: "contain",
    marginBottom: 5,
  },
  paymentText: {
    color: "#4D2600",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
  },
  registerButton: {
    backgroundColor: "#4D2600",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 60,
  },
  buttonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default DonationScreen;
