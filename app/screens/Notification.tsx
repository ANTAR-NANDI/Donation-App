import React, { useEffect } from 'react';
import { View, Text, Platform, Alert } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const NotificationScreen = () => {
  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          Alert.alert('Permission not granted to get push token for push notification!');
          return;
        }

        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

        if (!projectId) {
          Alert.alert('Project ID not found');
          return;
        }

        try {
          const pushToken = (
            await Notifications.getExpoPushTokenAsync({ projectId })
          ).data;
          console.log('Expo Push Token:', pushToken);
        } catch (error) {
          Alert.alert('Failed to get push token', String(error));
        }
      } else {
        Alert.alert('Must use physical device for push notifications');
      }
    };

    registerForPushNotificationsAsync();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Notification Screen</Text>
    </View>
  );
};

export default NotificationScreen;
