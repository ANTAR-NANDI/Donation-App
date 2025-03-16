import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React,{useState, useEffect} from 'react'

const NotificationScreen = ({ navigation }: any) => {
    const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications from an API or AsyncStorage
    const fetchNotifications = async () => {
      try {
        // Example of fetching notifications from AsyncStorage or replace with an API call
        const savedNotifications = [
          { id: '1', title: 'New Message', description: 'You have received a new message.' },
          { id: '2', title: 'App Update', description: 'New app update is available.' },
          { id: '3', title: 'Reminder', description: 'Don\'t forget your meeting at 3 PM.' },
        ];
        setNotifications(savedNotifications); // Replace with fetched data
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity style={styles.notificationItem} onPress={() => handleNotificationClick(item)}>
      <View>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleNotificationClick = (notification) => {
    // Handle the notification click, e.g., navigate to a detail page
    console.log('Notification clicked:', notification);
    // Example navigation to notification detail page
    navigation.navigate('NotificationDetail', { notification });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      {notifications.length === 0 ? (
        <Text style={styles.noNotifications}>No new notifications</Text>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noNotifications: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  notificationItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationDescription: {
    fontSize: 14,
    color: 'gray',
  },
});
export default NotificationScreen;