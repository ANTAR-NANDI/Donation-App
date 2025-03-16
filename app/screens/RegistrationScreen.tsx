// RegistrationScreen.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';

const RegistrationScreen = ({ navigation }: any) => {
  const handleRegister = () => {
    // Here, add your registration logic (API call, Firebase, etc.)
    
    // After successful registration, navigate to the main app's TabNavigator
    navigation.replace('App');  // This will replace the registration screen with the TabNavigator
  };

  return (
    <View>
      <Text>Registration Screen</Text>
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

export default RegistrationScreen;
