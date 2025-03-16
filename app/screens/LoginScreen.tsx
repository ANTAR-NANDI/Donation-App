// LoginScreen.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';

const LoginScreen = ({ navigation }: any) => {
  const handleLogin = () => {
    // Here, add your login logic (API call, Firebase, etc.)
    
    // After successful login, navigate to the main app's TabNavigator
    navigation.replace('App');  // This will replace the login screen with the TabNavigator
  };

  return (
    <View>
      <Text>Login Screen</Text>
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
