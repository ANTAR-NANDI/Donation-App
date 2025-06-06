import React, { useState, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Modal,
  Text,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import BASE_URL from "../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LogoutScreen from "../screens/LogoutScreen";
const ProfileDropdownMenu = () => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("@auth_token");
    navigation.reset({ index: 0, routes: [{ name: "Auth" }] });
  };
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("@auth_token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(`${BASE_URL}/user`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.photo);
      setUser(response.data.photo);
    } catch (error) {
      console.error(
        "Error fetching user data:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={{ marginRight: 15 }}
      >
        <Image
          source={{
            uri: `https://topoban.w3schoolbd.org/images/users/${user}`,
          }}
          style={styles.image}
        />
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >
          <View style={styles.dropdown}>
            <TouchableOpacity
              onPress={() => {
                setVisible(false);
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Profile" }],
                });
              }}
            >
              <Text style={styles.item}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                setVisible(false);
                await AsyncStorage.removeItem("@auth_token");

                navigation.reset({
                  index: 0,
                  routes: [{ name: "Auth" }],
                });
              }}
            >
              <Text style={styles.item}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    marginTop: 60,
    marginRight: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30, // Half of width/height for a circle
    resizeMode: "cover",
  },
  dropdown: {
    backgroundColor: "white",
    padding: 10,
    elevation: 5,
    borderRadius: 8,
    width: 150,
  },
  item: {
    paddingVertical: 10,
    fontSize: 16,
  },
});

export default ProfileDropdownMenu;
