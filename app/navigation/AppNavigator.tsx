// RootStackNavigator.js or App.js
import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nextProvider } from 'react-i18next'; // Import I18nextProvider
import i18n from '../../i18n'; // Import the i18n configuration
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/MemberRegistrationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import Index from '../screens/Index';
import DonationScreen from '../screens/DonationScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ChatScreen from '../screens/ChatScreen';
import MemberRegistrationScreen from '../screens/MemberRegistrationScreen';
import LogoutScreen from '../screens/LogoutScreen';
import NotificationDetailsScreen from '../screens/NotificationDetailsScreen';
import PronamiScreen from '../screens/PronamiScreen';
import DevoteeScreen from '../screens/DevoteeScreen';
import DevoteeDetailScreen from '../screens/DevoteeDetailScreen';
import ForgetPasswordScreen from '../screens/ForgetPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import NotificationProvider from '../screens/Notification-Provider';
import EditDevoteeScreen from '../screens/EditDevoteeScreen';

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
      name="MemberRegistration" 
      component={MemberRegistrationScreen} 
      // options={{ title: 'Member Registration' }}
      options={getScreenOptions(navigation, 'MemberRegistration')}  
    />
  </Stack.Navigator>
);
const DevoteeStackNavigator = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen name="AllDevotees" component={DevoteeScreen} options={{ title: 'All Devotees' }} />
    <Stack.Screen  name="DevoteeDetail" component={DevoteeDetailScreen} 
    options={{
        headerShown: false
      }} 
    />
    <Stack.Screen  options={{
        headerShown: false
      }}   name="EditDevotee"  component={EditDevoteeScreen} />
       <Stack.Screen 
      name="MemberRegistration" 
      component={MemberRegistrationScreen} 
      // options={{ title: 'Member Registration' }}
      options={{
        headerShown: false
      }}  
    />
  </Stack.Navigator>
);
// Stack Navigator for the Notification section
const NotificationStackNavigator = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Notification" 
      component={NotificationScreen} 
      options={getScreenOptions(navigation, 'Home')} 
    />
    <Stack.Screen 
      name="NotificationDetail" 
      component={NotificationDetailsScreen} 
      options={{ title: 'Notification Details' }} 
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
        tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
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
      component={NotificationStackNavigator}
      options={{
        headerShown: false,
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
  <Drawer.Navigator>
    <Drawer.Screen 
      name="Dashboard" 
      component={TabNavigator} 
      options={{
        headerShown: false,
        drawerIcon: () => <Ionicons name="home-outline" size={24} color="black" />,
      }} 
    />
    <Drawer.Screen 
      name="Profile" 
      component={ProfileScreen} 
      options={{
        drawerIcon: () => <Ionicons name="person-outline" size={24} color="black" />,
      }} 
    />
    <Drawer.Screen 
      name="Chat" 
      component={ChatScreen} 
      options={{
        drawerIcon: () => <Ionicons name="chatbubbles-outline" size={24} color="black" />,
      }} 
    />
    <Drawer.Screen 
      name="News" 
      component={NotificationScreen} 
      options={{
        drawerIcon: () => <Ionicons name="notifications-outline" size={24} color="black" />,
      }} 
    />
    <Drawer.Screen 
      name="Pronami" 
      component={PronamiScreen} 
      options={{
        drawerIcon: () => <Ionicons name="heart-outline" size={24} color="black" />,
      }} 
    />
    <Drawer.Screen 
      name="Devotees" 
      component={DevoteeStackNavigator} 
      options={{
        drawerIcon: () => <Ionicons name="person-outline" size={24} color="black" />,
      }} 
    />
    <Drawer.Screen 
      name="Logout" 
      component={LogoutScreen}
      options={{
        headerShown: false,
        drawerIcon: () => <Ionicons name="log-out-outline" size={24} color="black" />,
      }} 
    />
  </Drawer.Navigator>
);

// Authentication Stack
const AuthStack = () => (
  <Stack.Navigator initialRouteName="Index">
    <Stack.Screen name="Index" component={Index} options={{ title: 'Home' }} />
    <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
    <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} options={{ title: 'Forget Password' }} />
    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ title: 'Reset Password' }} />
    <Stack.Screen name="Register" component={RegistrationScreen} />
  </Stack.Navigator>
);

// Root Navigator
const RootStackNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthToken = async () => {
      const token = await AsyncStorage.getItem('@auth_token');
      setIsAuthenticated(!!token);
    };

    checkAuthToken();
  }, []);

  if (isAuthenticated === null) {
    // You can return a loading screen or null while checking the auth token
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}> {/* Wrap your navigator with I18nextProvider */}
      <NotificationProvider>
        <Stack.Navigator initialRouteName={isAuthenticated ? 'App' : 'Auth'}>
          <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} />
          <Stack.Screen name="App" component={DrawerNavigator} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NotificationProvider>
    </I18nextProvider>
  );
};

export default RootStackNavigator;
