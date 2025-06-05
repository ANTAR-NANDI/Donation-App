import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const LogoutScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const logout = async () => {
      await AsyncStorage.removeItem("@auth_token");
      navigation.reset({
        index: 0,
        routes: [{ name: "Auth" }],
      });
    };

    logout();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default LogoutScreen;
