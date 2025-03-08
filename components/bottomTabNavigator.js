import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Products from "./Product";

// Dummy Screens
const TaskScreen = () => <View style={styles.screen}><Text>Task Screen</Text></View>;
const ProductsScreen = () => <View style={styles.screen}><Products/></View>;
const OrderHistoryScreen = () => <View style={styles.screen}><Text>Order History Screen</Text></View>;
const ProfileScreen = () => <View style={styles.screen}><Text>Profile Screen</Text></View>;

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Task") {
            iconName = focused ? "clipboard-text" : "clipboard-text-outline";
          } else if (route.name === "Products") {
            iconName = focused ? "package-variant" : "package-variant-closed";
          } else if (route.name === "Order History") {
            iconName = focused ? "history" : "history";
          } else if (route.name === "Profile") {
            iconName = focused ? "account" : "account-outline";
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0.5,
          borderTopColor: "#ddd",
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Task" component={TaskScreen} />
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="Order History" component={OrderHistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BottomTabNavigator;
