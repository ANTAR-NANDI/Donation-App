import React,{useState} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import Index from '../screens/Index';
import NotificationScreen from '../screens/NotificationScreen';
import DonationScreen from '../screens/DonationScreen';
import BookmarkScreen from '../screens/BookmarkScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Create a Stack Navigator for the Dashboard Tab that includes the DetailsScreen
const DashboardStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: 'Home', headerShown: true }}
    />
    <Stack.Screen
      name="Details"
      component={DetailsScreen}
      options={{
        title: 'Details',
        headerStyle: { backgroundColor: '#626868' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    />
  </Stack.Navigator>
);

// Tab Navigator (Main app screen after login)
const TabNavigator = () => (
  <Tab.Navigator>
    {/* Dashboard tab with its own stack navigator */}
    <Tab.Screen
      name="Dashboard"
      component={DashboardStackNavigator}
      options={{ headerShown: false }}  // Tab bar will be shown when this tab is active
    />
    {/* Bookmarks Tab */}
    <Tab.Screen
      name="bookmark"
      component={BookmarkScreen}
      options={{ headerShown: false }}
    />
    {/* Create Tab */}
    <Tab.Screen
      name="donation"
      component={DonationScreen}
      options={{ headerShown: false }}
    />
    {/* Notifications Tab */}
    <Tab.Screen
      name="notifications"
      component={NotificationScreen}
      options={{ headerShown: false }}
    />
    {/* Profile Tab */}
    <Tab.Screen
      name="profile"
      component={ProfileScreen}
      options={{ headerShown: false }}
    />
  </Tab.Navigator>
);

// Root Stack Navigator (handles login/registration and authenticated users)
const RootStackNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Stack.Navigator initialRouteName={isAuthenticated ? "App" : "Auth"}>
      {/* Authentication screens */}
      <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} />
      {/* Main app screens (TabView) */}
      <Stack.Screen name="App" component={TabNavigator} options={{ headerShown: false }} />
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
        title: 'Home',
        headerStyle: { backgroundColor: '#626868' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    />
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{
        title: 'Login',
        headerStyle: { backgroundColor: '#626868' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    />
    <Stack.Screen name="Register" component={RegistrationScreen} />
  </Stack.Navigator>
);

export default RootStackNavigator;
