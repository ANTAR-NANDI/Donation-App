// AppNavigator.tsx
import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import Index from '../screens/Index';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator (Main app screen after login)
const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// Root Stack Navigator (handles login/registration and authenticated users)
const RootStackNavigator = () => {
  // Authentication state to check if the user is logged in
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Stack.Navigator initialRouteName={isAuthenticated ? "App" : "Auth"}>
      {/* Authentication screens */}
      <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} />
      {/* Main app screens (TabView) */}
      <Stack.Screen name="App" component={TabNavigator} />
    </Stack.Navigator>
  );
};

// Auth Stack Navigator (Login & Registration flow)
const AuthStack = () => (
  <Stack.Navigator initialRouteName="Index">
    <Stack.Screen
  name="Index"
  component={Index}
  options={{
    title: 'Home',  // Title that appears in the header
    headerStyle: {
      backgroundColor: '#626868', // Set the header background color (for example, Tomato red)
    },
    headerTintColor: '#fff', // Set the color of the title text
    headerTitleStyle: {
      fontWeight: 'bold', // Optional: to make the title bold
    },
  }}
/>
    <Stack.Screen name="Login" component={LoginScreen}
    options={{
    title: 'Login ',  // Title that appears in the header
    headerStyle: {
      backgroundColor: '#626868', // Set the header background color (for example, Tomato red)
    },
    headerTintColor: '#fff', // Set the color of the title text
    headerTitleStyle: {
      fontWeight: 'bold', // Optional: to make the title bold
    },
  }}
    />
    <Stack.Screen name="Register" component={RegistrationScreen} />
  </Stack.Navigator>
);

export default RootStackNavigator;
