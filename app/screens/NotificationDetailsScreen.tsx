import { View, Text, StyleSheet,ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from "../../config";

const NotificationDetailScreen = ({ route }) => {
  const { id } = route.params;
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotificationDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("@auth_token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get(`${BASE_URL}/news-details/${id}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setNotification(response.data.news);
      } catch (error) {
        setError("Failed to load notification details");
      }
    };

    fetchNotificationDetails();
  }, [id]);


  return (
    <ScrollView>
            <View style={styles.container}>
                {notification ? (
                    <>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationDescription}>{notification.description}</Text>
                    </>
                ) : error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : (
                    <Text>Loading...</Text>
                )}
            </View>
    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  notificationId: {
    fontSize: 18,
    color: '#666',
  },
  notificationTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 10,
  },
  notificationDescription: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default NotificationDetailScreen;
