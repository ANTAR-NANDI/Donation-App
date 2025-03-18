import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Button,TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
const LogoutScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(true);  // Start with the modal visible

  // Function to handle logout
  const handleLogout = async () => {
     try {
        setModalVisible(false)
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
  const returnHome = async () => {
    try {
      // Remove authentication data (e.g., token) from storage
      setModalVisible(false)
      navigation.replace('App');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Are you sure you want to logout?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              {/* Yes, Logout Button with Danger styling */}
              <TouchableOpacity
                style={styles.dangerButton}
                onPress={handleLogout}
              >
                <Text style={styles.dangerButtonText}>Yes, Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
     cancelButton: {
    backgroundColor: '#ccc', // Light grey color for cancel
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
  },
  dangerButton: {
    backgroundColor: 'red',  // Danger red color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  dangerButtonText: {
    color: 'white',
    fontSize: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
});

export default LogoutScreen;
