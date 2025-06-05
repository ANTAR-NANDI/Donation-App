import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Modal,
  Text,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LogoutScreen from "../screens/LogoutScreen";
const ProfileDropdownMenu = () => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("@auth_token");
    navigation.reset({ index: 0, routes: [{ name: "Auth" }] });
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={{ marginRight: 15 }}
      >
        <Image
          source={require("../../assets/images/user.png")}
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
