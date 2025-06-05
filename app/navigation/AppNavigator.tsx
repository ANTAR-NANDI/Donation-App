import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";

import HomeScreen from "../screens/HomeScreen";
import MemberRegistrationScreen from "../screens/MemberRegistrationScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LoginScreen from "../screens/LoginScreen";
import RegistrationScreen from "../screens/RegistrationScreen";
import Index from "../screens/Index";
import DonationScreen from "../screens/DonationScreen";
import NotificationScreen from "../screens/NotificationScreen";
import ChatScreen from "../screens/ChatScreen";
import LogoutScreen from "../screens/LogoutScreen";
import NotificationDetailsScreen from "../screens/NotificationDetailsScreen";
import NewsDetailScreen from "../screens/NewsDetailsScreen";
import NewsScreen from "../screens/NewsScreen";
import PronamiScreen from "../screens/PronamiScreen";
import AddPronamiScreen from "../screens/AddPronamiScreen";
import DevoteeScreen from "../screens/DevoteeScreen";
import DevoteeDetailScreen from "../screens/DevoteeDetailScreen";
import ForgetPasswordScreen from "../screens/ForgetPasswordScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import NotificationProvider from "../screens/Notification-Provider";
import EditDevoteeScreen from "../screens/EditDevoteeScreen";
import PaymentDetailsScreen from "../screens/PaymentDetailsScreen";
import ProfileDropdownMenu from "../screens/ProfileDropdownMenu ";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const defaultStackOptions = ({ navigation }) => ({
  headerLeft: () =>
    navigation.canGoBack() ? (
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ marginLeft: 15 }}
      >
        <Ionicons name="arrow-back-outline" size={24} color="black" />
      </TouchableOpacity>
    ) : null,
});

const DashboardStackNavigator = () => (
  <Stack.Navigator screenOptions={defaultStackOptions}>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        title: "Home",
        headerRight: () => <ProfileDropdownMenu />,
      }}
    />
    <Stack.Screen
      name="MemberRegistration"
      component={MemberRegistrationScreen}
      options={{ title: "Member Registration" }}
    />
    <Stack.Screen
      name="Logout"
      component={LogoutScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: "Profile" }}
    />
  </Stack.Navigator>
);

const DevoteeStackNavigator = () => (
  <Stack.Navigator screenOptions={defaultStackOptions}>
    <Stack.Screen
      name="AllDevotees"
      component={DevoteeScreen}
      options={{ title: "All Devotees" }}
    />
    <Stack.Screen
      name="DevoteeDetail"
      component={DevoteeDetailScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="EditDevotee"
      component={EditDevoteeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="MemberRegistration"
      component={MemberRegistrationScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const NewsStackNavigator = () => (
  <Stack.Navigator screenOptions={defaultStackOptions}>
    <Stack.Screen
      name="News"
      component={NewsScreen}
      options={{ title: "All News" }}
    />
    <Stack.Screen
      name="NewsDetail"
      component={NewsDetailScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const NotificationStackNavigator = () => (
  <Stack.Navigator screenOptions={defaultStackOptions}>
    <Stack.Screen
      name="Notification"
      component={NotificationScreen}
      options={{ title: "Notifications" }}
    />
    <Stack.Screen
      name="NotificationDetail"
      component={NotificationDetailsScreen}
      options={{ title: "Notification Details" }}
    />
  </Stack.Navigator>
);

const DonationStackNavigator = () => (
  <Stack.Navigator screenOptions={defaultStackOptions}>
    <Stack.Screen
      name="Donation"
      component={DonationScreen}
      options={{ title: "Donation" }}
    />
    <Stack.Screen
      name="DonationDetail"
      component={PaymentDetailsScreen}
      options={{ title: "Payment Details" }}
    />
  </Stack.Navigator>
);
const ChatStackNavigator = () => (
  <Stack.Navigator screenOptions={defaultStackOptions}>
    <Stack.Screen
      name="Chat"
      component={ChatScreen}
      options={{ title: "Chat" }}
    />
  </Stack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen
      name="Dashboard"
      component={DashboardStackNavigator}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Chat"
      component={ChatStackNavigator}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="chatbubbles-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Devotees"
      component={DevoteeStackNavigator}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="people-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Donation"
      component={DonationStackNavigator}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="card-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Notifications"
      component={NotificationStackNavigator}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="notifications-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="News"
      component={NewsStackNavigator}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="newspaper-outline" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator initialRouteName="Index" screenOptions={defaultStackOptions}>
    <Stack.Screen name="Index" component={Index} options={{ title: "Home" }} />
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ title: "Login" }}
    />
    <Stack.Screen
      name="ForgetPassword"
      component={ForgetPasswordScreen}
      options={{ title: "Forget Password" }}
    />
    <Stack.Screen
      name="ResetPassword"
      component={ResetPasswordScreen}
      options={{ title: "Reset Password" }}
    />
    <Stack.Screen name="Register" component={RegistrationScreen} />
  </Stack.Navigator>
);

const RootStackNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuthToken = async () => {
      const token = await AsyncStorage.getItem("@auth_token");
      setIsAuthenticated(!!token);
    };
    checkAuthToken();
  }, []);

  if (isAuthenticated === null) return null;

  return (
    <I18nextProvider i18n={i18n}>
      <NotificationProvider>
        <Stack.Navigator initialRouteName={isAuthenticated ? "App" : "Auth"}>
          <Stack.Screen
            name="Auth"
            component={AuthStack}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="App"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NotificationProvider>
    </I18nextProvider>
  );
};

export default RootStackNavigator;
