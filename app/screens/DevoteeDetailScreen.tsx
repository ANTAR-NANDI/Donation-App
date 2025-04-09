import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from "../../config";

const DevoteeDetailScreen = ({ route }: any) => {
  const { id } = route.params;
  const [devotee, setDevotee] = useState(null); // Set initial state to null
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDevoteeDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("@auth_token");
        if (!token) {
          console.error("No token found");
          return;
        }
        
        const response = await axios.get(`${BASE_URL}/get_devotee_details/${id}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // Log the full response to verify the data structure
        console.log(response.data);

        setDevotee(response.data.devotee); // Store the fetched devotee data
      } catch (error) {
        setError("Failed to load devotee details");
      }
    };

    fetchDevoteeDetails();
  }, [id]);

  // Show error or loading message
  if (error) {
    return <Text>Error: {error}</Text>;
  }

  if (!devotee) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Devotee Details</Text>
      <View style={styles.detail}>
        <Text style={styles.label}>Name:</Text>
        <Text>{devotee.name}</Text>
      </View>
      <View style={styles.detail}>
        <Text style={styles.label}>Relation:</Text>
        <Text>{devotee.relation}</Text>
      </View>
      <View style={styles.detail}>
        <Text style={styles.label}>Status:</Text>
        <Text>{devotee.approved ? "Active" : "Inactive"}</Text>
      </View>
      {/* Add more fields here as needed */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9e6c8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detail: {
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default DevoteeDetailScreen;
