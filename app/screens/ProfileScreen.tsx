import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';

const ProfileScreen = ({ navigation }: any) => {
  const router = useRouter();
  const [user, setUser] = useState(null); // State to store user data

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("@auth_token"); 

        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get("http://192.168.0.174:8000/api/user", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data); // Update state with user data
      } catch (error) {
        console.error("Error fetching user data:", error.response?.data || error.message);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('@auth_token');
      await AsyncStorage.removeItem('@auth_token');

      if (token) {
        await axios.post('http://192.168.0.174:8000/api/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

     navigation.replace('Auth');
    } catch (error) {
      console.error('Error during logout', error);
      Toast.show({ type: 'error', text1: 'Logout Error', text2: 'Failed to log out' });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Image 
          source={require('../../assets/images/user.png')}
          style={styles.profileImage} 
        />
        <Text style={styles.userName}>{user?.name || 'Loading...'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'Loading...'}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  profileCard: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#FF5733',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '60%',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default ProfileScreen;
