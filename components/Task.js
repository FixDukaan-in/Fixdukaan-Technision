import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const dummyTasks = [
  {
    id: "1",
    customer: "John Doe",
    device: "iPhone 13",
    brand: "Apple",
    issue: "Screen cracked",
    timeSlot: "10 AM - 1 PM",
    date: "2025-03-08",
    address: "123 Main St, New York, NY",
  },
  {
    id: "2",
    customer: "Jane Smith",
    device: "Galaxy S22",
    brand: "Samsung",
    issue: "Battery draining fast",
    timeSlot: "1 PM - 4 PM",
    date: "2025-03-09",
    address: "456 Elm St, Los Angeles, CA",
  },
];

const TaskScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚀 Your Next Mission 🚀</Text>
      <FlatList
        data={dummyTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("OrderDetails", { task: item })}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.headerText}>NEW TASK</Text>
            </View>
            <View style={styles.cardBody}>
              <MaterialIcons name="person" size={20} color="#fd7e14" />
              <Text style={styles.text}> {item.customer}</Text>
            </View>
            <View style={styles.cardBody}>
              <MaterialIcons name="smartphone" size={20} color="#fd7e14" />
              <Text style={styles.text}>
                {" "}
                {item.device} ({item.brand})
              </Text>
            </View>
            <View style={styles.cardBody}>
              <MaterialIcons name="error-outline" size={20} color="#fd7e14" />
              <Text style={styles.text}> {item.issue}</Text>
            </View>
            <View style={styles.cardBody}>
              <MaterialIcons name="location-on" size={20} color="#fd7e14" />
              <Text style={styles.text}> {item.address}</Text>
            </View>
            <View style={styles.cardBody}>
              <MaterialIcons name="schedule" size={20} color="#fd7e14" />
              <Text style={styles.text}>
                {" "}
                {item.date} | {item.timeSlot}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#565656",
    marginBottom: 16,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ff9913",
  },
  cardHeader: {
    backgroundColor: "#ff9913",
    padding: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: "center",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  cardBody: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  text: {
    fontSize: 16,
    color: "#444",
    marginLeft: 10,
  },
});

export default TaskScreen;
