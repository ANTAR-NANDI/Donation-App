import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Card, Avatar } from 'react-native-paper';

const HomeScreen = ({ navigation }: any) => {
  return (
    // <View>
    //   <Text>Home Screen</Text>
    //   <Button title="Go to Details" onPress={() => navigation.navigate('Details')} />
    // </View>
     <View style={styles.container}>
      <Text style={styles.header}>Welcome to Central Tapoban Ashram</Text>

      {/* Add Image Here */}
      <Image source={require('../../assets/images/dashboard.jpg')} style={styles.image} />

      {/* Card Button to Open Modal */}
      <TouchableOpacity onPress={() => navigation.navigate('MemberRegistration')}>
        <Card style={styles.footerCard}>
          <View style={styles.iconContainer}>
            <Avatar.Icon size={40} icon="clipboard-text" style={styles.icon} />
          </View>
          <Text style={styles.footerText}>শিষ্য নিবন্ধন করতে ক্লিক করুন</Text>
        </Card>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#c4a484',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  image: {
    width: '90%', // Adjust width as necessary
    height: 280, // Adjust height as necessary
    borderRadius: 10,
    marginBottom: 20, // Add margin if you want space between image and form
  },
  footerCard: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#fff',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    backgroundColor: '#6200ee',
  },
  footerText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  formContainer: {
    paddingVertical: 10,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 8,
    borderRadius: 5,
  },
  registerButton: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
});


export default HomeScreen;
