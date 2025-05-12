import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import OrdersScreen from "./screens/OrderDetails";
import OrderDetailScreen from "./screens/OrderDetailScreen";
import ComplaintScreen from "./screens/ComplaintScreen";
import TechnicianDetailsScreen from "./screens/TechnicianDetails";
import TechnicianDetailScreen from "./screens/TechnicianInfo";
import GrowthScreen from "./screens/GrowthScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator for Orders
const OrdersStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: "#fff" },
      headerTintColor: "#fd7e14",
      headerTitleStyle: { fontWeight: "bold" },
    }}
  >
    <Stack.Screen
      name="OrdersList"
      component={OrdersScreen}
      options={{ title: "Orders" }}
    />
    <Stack.Screen
      name="OrderDetail"
      component={OrderDetailScreen}
      options={{ title: "Order Details" }}
    />
  </Stack.Navigator>
);

// Stack Navigator for Complaints
const ComplaintsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: "#fff" },
      headerTintColor: "#fd7e14",
      headerTitleStyle: { fontWeight: "bold" },
    }}
  >
    <Stack.Screen
      name="ComplaintsList"
      component={ComplaintScreen}
      options={{ title: "Complaints" }}
    />
  </Stack.Navigator>
);

// Stack Navigator for Technician Details
const TechnicianStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: "#fff" },
      headerTintColor: "#fd7e14",
      headerTitleStyle: { fontWeight: "bold" },
    }}
  >
    <Stack.Screen
      name="TechnicianList"
      component={TechnicianDetailsScreen}
      options={{ title: "Technician Details" }}
    />
    <Stack.Screen
      name="TechnicianInfo"
      component={TechnicianDetailScreen}
      options={{ title: "Technician Info" }}
    />
  </Stack.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Orders") {
              iconName = focused ? "list" : "list-outline";
            } else if (route.name === "Technicians") {
              iconName = focused ? "people" : "people-outline";
            } else if (route.name === "Complaints") {
              iconName = focused ? "alert" : "alert-outline";
            } else if (route.name === "Growth") {
              iconName = focused ? "trending-up" : "trending-up-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#fd7e14",
          tabBarInactiveTintColor: "#575757",
          tabBarStyle: {
            backgroundColor: "#fff",
            paddingBottom: 5,
            height: 60,
          },
        })}
      >
        <Tab.Screen
          name="Orders"
          component={OrdersStack}
          options={{ tabBarLabel: "Orders", headerShown: false }}
        />
        <Tab.Screen
          name="Technicians"
          component={TechnicianStack}
          options={{ tabBarLabel: "Technicians", headerShown: false }}
        />
        <Tab.Screen
          name="Complaints"
          component={ComplaintsStack}
          options={{ tabBarLabel: "Complaints", headerShown: false }}
        />
        <Tab.Screen
          name="Growth"
          component={GrowthScreen}
          options={{ tabBarLabel: "Growth" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
