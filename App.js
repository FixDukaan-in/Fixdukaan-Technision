import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Products from "./components/Product";
import OrderHistory from "./components/OrderHistory";
import Task from "./components/Task";
import HeaderScreen from "./screens/HeaderScreen";
import OrderDetailsScreen from "./screens/OrderDetailScreen";
import TaskDetailScreen from "./screens/TaskDetailsScreen";
import Profile from "./components/Profile";

import { ProductProvider } from "./context/ProductContext"; // 🆕 Wrapped here

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Task Stack Navigator
const TaskStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="TaskMain"
      component={TaskScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="OrderDetails"
      component={OrderDetailsScreen}
      options={{
        title: "Order Details",
        headerStyle: { backgroundColor: "#ffffff" },
        headerTintColor: "#fd7e14",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    />
    <Stack.Screen
      name="TaskDetailScreen"
      component={TaskDetailScreen}
      options={{
        title: "Task Detail",
        headerStyle: { backgroundColor: "#fd7e14" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    />
  </Stack.Navigator>
);

// Each Screen with HeaderScreen
const TaskScreen = () => (
  <View style={styles.container}>
    <HeaderScreen />
    <Task />
  </View>
);

const ProductsScreen = () => (
  <View style={styles.container}>
    <HeaderScreen />
    <Products />
  </View>
);

const OrderHistoryScreen = () => (
  <View style={styles.container}>
    <HeaderScreen />
    <OrderHistory />
  </View>
);

const ProfileScreen = () => (
  <View style={styles.container}>
    <HeaderScreen />
    <Profile />
  </View>
);

// Main App with ProductProvider
export default function App() {
  return (
    <ProductProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === "Task") {
                iconName = focused
                  ? "clipboard-text"
                  : "clipboard-text-outline";
              } else if (route.name === "Products") {
                iconName = focused
                  ? "package-variant"
                  : "package-variant-closed";
              } else if (route.name === "Order History") {
                iconName = "history";
              } else if (route.name === "Profile") {
                iconName = focused ? "account" : "account-outline";
              }

              return (
                <MaterialCommunityIcons
                  name={iconName}
                  size={size}
                  color={color}
                />
              );
            },
            tabBarActiveTintColor: "#fd7e14",
            tabBarInactiveTintColor: "#575757",
            tabBarStyle: {
              backgroundColor: "#ffffff",
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
          <Tab.Screen name="Task" component={TaskStack} />
          <Tab.Screen name="Products" component={ProductsScreen} />
          <Tab.Screen name="Order History" component={OrderHistoryScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </ProductProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center", // Center content vertically
    padding: 20, // Padding for content
  },
  screenContent: {
    paddingBottom: 20, // To prevent the content from being cut off at the bottom
  },
});
