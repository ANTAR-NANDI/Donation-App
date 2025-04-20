// RootStackNavigator.js or App.js
import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import HomeScreen from '../screens/HomeScreen';
import MemberRegistrationScreen from '../screens/MemberRegistrationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import Index from '../screens/Index';
import DonationScreen from '../screens/DonationScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ChatScreen from '../screens/ChatScreen';
import LogoutScreen from '../screens/LogoutScreen';
import NotificationDetailsScreen from '../screens/NotificationDetailsScreen';
import NewsDetailScreen from '../screens/NewsDetailsScreen';
import NewsScreen from '../screens/NewsScreen';
import PronamiScreen from '../screens/PronamiScreen';
import AddPronamiScreen from '../screens/AddPronamiScreen';
import DevoteeScreen from '../screens/DevoteeScreen';
import DevoteeDetailScreen from '../screens/DevoteeDetailScreen';
import ForgetPasswordScreen from '../screens/ForgetPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import NotificationProvider from '../screens/Notification-Provider';
import EditDevoteeScreen from '../screens/EditDevoteeScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const getScreenOptions = (navigation, title) => ({
  title: title,
  headerLeft: () => (
    <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 15 }}>
      <Ionicons name="menu-outline" size={28} color="black" />
    </TouchableOpacity>
  ),
});

const DashboardStackNavigator = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} options={getScreenOptions(navigation, 'Home')} />
    <Stack.Screen name="MemberRegistration" component={MemberRegistrationScreen} options={getScreenOptions(navigation, 'Member Registration')} />
  </Stack.Navigator>
);

const DevoteeStackNavigator = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen name="AllDevotees" component={DevoteeScreen} options={{ title: 'All Devotees' }} />
    <Stack.Screen name="DevoteeDetail" component={DevoteeDetailScreen} options={{ headerShown: false }} />
    <Stack.Screen name="EditDevotee" component={EditDevoteeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="MemberRegistration" component={MemberRegistrationScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const PronamiStackNavigator = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen name="AllPronamis" component={PronamiScreen} options={{ title: 'All Pronamis' }} />
    <Stack.Screen name="AddPronami" component={AddPronamiScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);


const NewsStackNavigator = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen name="News" component={NewsScreen} options={{ title: 'All News' }} />
    <Stack.Screen name="NewsDetail" component={NewsDetailScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const NotificationStackNavigator = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen name="Notification" component={NotificationScreen} options={getScreenOptions(navigation, 'Notifications')} />
    <Stack.Screen name="NotificationDetail" component={NotificationDetailsScreen} options={{ title: 'Notification Details' }} />
  </Stack.Navigator>
);

const TabNavigator = ({ navigation }) => (
  <Tab.Navigator>
    <Tab.Screen
      name="Dashboard"
      component={DashboardStackNavigator}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Chat"
      component={ChatScreen}
      options={{
        tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles-outline" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Donation"
      component={DonationScreen}
      options={{
        tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Notifications"
      component={NotificationStackNavigator}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => <Ionicons name="notifications-outline" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
      }}
    />
  </Tab.Navigator>
);

const DrawerNavigator = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="Dashboard" component={TabNavigator} options={{ headerShown: false, drawerIcon: () => <Ionicons name="home-outline" size={24} color="black" /> }} />
    <Drawer.Screen name="Profile" component={ProfileScreen} options={{ drawerIcon: () => <Ionicons name="person-outline" size={24} color="black" /> }} />
    <Drawer.Screen name="Chat" component={ChatScreen} options={{ drawerIcon: () => <Ionicons name="chatbubbles-outline" size={24} color="black" /> }} />
    <Drawer.Screen name="News" component={NewsStackNavigator} options={{ drawerIcon: () => <Ionicons name="notifications-outline" size={24} color="black" /> }} />
    <Drawer.Screen name="Pronami" component={PronamiStackNavigator} options={{ drawerIcon: () => <Ionicons name="heart-outline" size={24} color="black" /> }} />
    <Drawer.Screen name="Devotees" component={DevoteeStackNavigator} options={{ drawerIcon: () => <Ionicons name="person-outline" size={24} color="black" /> }} />
    <Drawer.Screen name="Logout" component={LogoutScreen} options={{ headerShown: false, drawerIcon: () => <Ionicons name="log-out-outline" size={24} color="black" /> }} />
  </Drawer.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator initialRouteName="Index">
    <Stack.Screen name="Index" component={Index} options={{ title: 'Home' }} />
    <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
    <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} options={{ title: 'Forget Password' }} />
    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ title: 'Reset Password' }} />
    <Stack.Screen name="Register" component={RegistrationScreen} />
  </Stack.Navigator>
);

const RootStackNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuthToken = async () => {
      const token = await AsyncStorage.getItem('@auth_token');
      setIsAuthenticated(!!token);
    };
    checkAuthToken();
  }, []);

  if (isAuthenticated === null) return null;

  return (
    <I18nextProvider i18n={i18n}>
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
