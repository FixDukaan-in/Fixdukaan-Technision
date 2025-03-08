
import React, { useState } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import BottomTabNavigator from "../components/bottomTabNavigator"; // Import bottom tabs

const HeaderScreen = () => {
  const [isOnline, setIsOnline] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.infoContainer}>
          <Text style={styles.greeting}>Hi, BOSS</Text>
          <Text style={styles.details}>14.30.3 | GCEBOD122421160 | 3577 | 0</Text>
        </View>

        {/* Toggle Switch and Bell Icon */}
        <View style={styles.controls}>
          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            thumbColor={isOnline ? "#4CAF50" : "#ccc"}
            trackColor={{ false: "#ccc", true: "#4CAF50" }}
          />
          <Text style={styles.status}>{isOnline ? "ONLINE" : "OFFLINE"}</Text>
          <MaterialIcons name="notifications-none" size={24} color="#333" />
        </View>
      </View>

      {/* Bottom Tab Navigator */}
      <View style={styles.navigatorContainer}>
        <BottomTabNavigator />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: '15'
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  infoContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  details: {
    fontSize: 14,
    color: "#666",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
  },
  status: {
    marginHorizontal: 10,
    fontSize: 14,
    color: "#666",
  },
  navigatorContainer: {
    flex: 1, // Ensure BottomTabNavigator takes full height
  },
});

export default HeaderScreen;
