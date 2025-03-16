import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import Index from '../screens/Index';
import DonationScreen from '../screens/DonationScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ChatScreen from '../screens/ChatScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Function to add the drawer icon in the header
const getScreenOptions = (navigation, title) => ({
  title,
  headerLeft: () => (
    <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 15 }}>
      <Ionicons name="menu-outline" size={28} color="black" />
    </TouchableOpacity>
  ),
});

// Stack Navigator for the Home section
const DashboardStackNavigator = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Home" 
      component={HomeScreen} 
      options={getScreenOptions(navigation, 'Home')} 
    />
    <Stack.Screen 
      name="Details" 
      component={DetailsScreen} 
      options={{ title: 'Details' }} 
    />
  </Stack.Navigator>
);

// Bottom Tab Navigator
const TabNavigator = ({ navigation }) => (
  <Tab.Navigator>
    <Tab.Screen
      name="Dashboard"
      component={DashboardStackNavigator}
      options={{
        headerShown: false,
        ...getScreenOptions(navigation, 'Dashboard'),
        tabBarIcon: ({ color, size }) => <Ionicons  name="home-outline" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Chat"
      component={ChatScreen}
      options={{
        ...getScreenOptions(navigation, 'Chat'),
        tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles-outline" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Donation"
      component={DonationScreen}
      options={{
        ...getScreenOptions(navigation, 'Donations'),
        tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Notifications"
      component={NotificationScreen}
      options={{
        ...getScreenOptions(navigation, 'Notifications'),
        tabBarIcon: ({ color, size }) => <Ionicons name="notifications-outline" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        ...getScreenOptions(navigation, 'Profile'),
        tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
      }}
    />
  </Tab.Navigator>
);

// Drawer Navigator
const DrawerNavigator = () => (
  <Drawer.Navigator >
    <Drawer.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
    <Drawer.Screen name="Profile" component={ProfileScreen} />
    <Drawer.Screen name="Chat" component={ChatScreen} />
  </Drawer.Navigator>
);

// Authentication Stack
const AuthStack = () => (
  <Stack.Navigator initialRouteName="Index">
    <Stack.Screen name="Index" component={Index} options={{ title: 'Home' }} />
    <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
    <Stack.Screen name="Register" component={RegistrationScreen} />
  </Stack.Navigator>
);

// Root Navigator
const RootStackNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Stack.Navigator initialRouteName={isAuthenticated ? 'App' : 'Auth'}>
      <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} />
      <Stack.Screen name="App" component={DrawerNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default RootStackNavigator;
