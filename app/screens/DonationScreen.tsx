import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BASE_URL from "../../config";
import { Ionicons } from "@expo/vector-icons";

const PronamiTable = ({ navigation }: any) => {
  const [pronamisGrouped, setPronamisGrouped] = useState({});
  const [error, setError] = useState(null);

  const fetchPronamis = async () => {
    try {
      const token = await AsyncStorage.getItem("@auth_token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(`${BASE_URL}/get_pronamis`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const rawData = response.data.pronami;

      const flattened = Object.entries(rawData).flatMap(([relation, items]) =>
        items.map((item) => ({
          relation: relation.charAt(0).toUpperCase() + relation.slice(1),
          amount: item.amount,
          mobile_number: item.mobile_number,
          payment_method: item.payment_method,
        }))
      );

      const grouped = flattened.reduce((acc, curr) => {
        if (!acc[curr.relation]) acc[curr.relation] = [];
        acc[curr.relation].push(curr);
        return acc;
      }, {});

      setPronamisGrouped(grouped);
    } catch (error) {
      console.log(error);
      setError("Failed to load Pronamis");
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchPronamis();
    });

    return unsubscribe;
  }, [navigation]);

  const total = Object.values(pronamisGrouped)
    .flat()
    .reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddDonation")}
      >
        <Text style={styles.addButtonText}>Add Donation</Text>
      </TouchableOpacity>

      <View style={styles.table}>
        <View style={[styles.row, styles.header]}>
          <Text style={styles.cell}>Relation</Text>
          <Text style={styles.cell}>Payment</Text>
          <Text style={styles.cell}>Mobile</Text>
          <Text style={styles.cell}>Taka</Text>
        </View>

        {Object.entries(pronamisGrouped).map(([relation, items], relIdx) => (
          <React.Fragment key={relIdx}>
            <View style={[styles.row, { backgroundColor: "#fff4d1" }]}>
              <Text style={[styles.cell, styles.bold]}>
                {relation.toUpperCase()}
              </Text>
              <Text style={styles.cell}></Text>
              <Text style={styles.cell}></Text>
              <Text style={styles.cell}></Text>
            </View>

            {items.map((item, index) => (
              <View style={styles.row} key={index}>
                <Text style={styles.cell}>{item.relation}</Text>
                <Text style={styles.cell}>{item.payment_method || "N/A"}</Text>
                <Text style={styles.cell}>{item.mobile_number || "N/A"}</Text>
                <Text style={styles.cell}>{item.amount}৳</Text>
              </View>
            ))}
          </React.Fragment>
        ))}

        <View style={[styles.row, styles.footer]}>
          <Text style={styles.cell}></Text>
          <Text style={styles.cell}></Text>
          <Text style={styles.cell}></Text>
          <Text style={[styles.cell, styles.bold]}>Total Pronami:</Text>
          <Text style={[styles.cell, styles.bold]}>{total} Taka</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default PronamiTable;

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: "#ff7433",
    paddingVertical: 8,
    width: 100,
    margin: 20,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "black",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%", // Make the container full width
    marginBottom: 10,
  },

  refreshButton: {
    flex: 1, // Ensure the button takes available space
    alignSelf: "center", // Center the button vertically
    paddingHorizontal: 10,
    paddingVertical: 0,
    borderColor: "#c62828",
    borderWidth: 1,
    height: 50,
    marginLeft: 20,
  },
  container: {
    backgroundColor: "#e0c68e",
    padding: 16,
    flexGrow: 1,
  },
  button: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  table: {
    backgroundColor: "#f8b75d",
    borderRadius: 8,
    padding: 5,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#e4a548",
    paddingVertical: 6,
  },
  header: {
    backgroundColor: "#ffc971",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  footer: {
    backgroundColor: "#fcdca5",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  cell: {
    flex: 1,
    fontSize: 13,
    textAlign: "center",
    color: "#5b2d00",
  },
  bold: {
    fontWeight: "bold",
    color: "#a10000",
  },
});
