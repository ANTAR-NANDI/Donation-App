
import { useState, useEffect, useRef,PropsWithChildren } from 'react';
import * as Notifications from 'expo-notifications';
import registerForPushNotificationsAsync from './Notification';
import BASE_URL from "../../config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
Notifications.setNotificationHandler({

    
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
const NotificationProvider = ({children} : PropsWithChildren ) =>{
    const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  

useEffect(() => {
    const fetchAndStorePushToken = async () => {
      try {
        // Get the token
        const token = await registerForPushNotificationsAsync();

        if (token) {
          setExpoPushToken(token);
          await AsyncStorage.setItem('@expoPushToken', token);
          await saveTokenToServer(token); 
        }
      } catch (error) {
        console.error('Error fetching push token:', error);
      }
    };

    fetchAndStorePushToken();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification Response:', response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const saveTokenToServer = async (token: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/save-token`, {
                expo_token:token
            });
         console.log(response.data.message);
    } catch (error) {
         console.error(error.data.message);
    }
  };
  return <>{children}</>
}
export default NotificationProvider;