import React from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const dummyOrders = [
  {
    id: "1",
    customer: "John Doe",
    address: "123 Main St, New York",
    device: "iPhone 13",
    timeSlot: "10 AM - 1 PM",
    date: "2025-03-08",
  },
  {
    id: "2",
    customer: "Jane Smith",
    address: "456 Elm St, Los Angeles",
    device: "Samsung Galaxy S22",
    timeSlot: "1 PM - 4 PM",
    date: "2025-03-09",
  },
  {
    id: "3",
    customer: "Alex Johnson",
    address: "789 Oak St, Chicago",
    device: "MacBook Pro",
    timeSlot: "4 PM - 7 PM",
    date: "2025-03-10",
  },
  {
    id: "4",
    customer: "Emily Davis",
    address: "101 Pine St, Houston",
    device: "Dell XPS 15",
    timeSlot: "7 PM - 10 PM",
    date: "2025-03-11",
  },
];

const OrderHistory = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      <FlatList
        data={dummyOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Order Header */}
            <View style={styles.cardHeader}>
              <MaterialIcons
                name="receipt"
                size={24}
                color="#fff"
                style={styles.icon}
              />
              <Text style={styles.orderId}>Order ID: {item.id}</Text>
            </View>

            {/* Order Details */}
            <Text style={styles.text}>
              <Text style={styles.bold}>Customer:</Text> {item.customer}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Address:</Text> {item.address}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Device:</Text> {item.device}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Time Slot:</Text> {item.timeSlot}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Date:</Text> {item.date}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5E6", // Light theme background
    paddingHorizontal: 15,
    width: "100%",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#575757", // Primary text color
    marginVertical: 16,
  },
  list: {
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fd7e14", // Orange theme
    padding: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 10,
  },
  icon: {
    marginRight: 8,
  },
  orderId: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  text: {
    fontSize: 16,
    color: "#575757",
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
  },
});

export default OrderHistory;
