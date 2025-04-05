import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Modal,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Card } from "react-native-paper";

const TaskDetailScreen = ({ route }) => {
  const { task } = route.params;
  const [status, setStatus] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const openMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      task.address
    )}`;
    Linking.openURL(url);
  };

  const callCustomer = () => {
    Linking.openURL(`tel:${task.phone}`);
  };

  // Determine status flow based on service type
  const statuses =
    task.serviceType === "Repair at Home"
      ? ["Technician Arrived", "Cost Verification", "Repaired", "Payment Done"]
      : [
          "Product Picked",
          "Cost Verification",
          "Repair in Progress",
          "Ready to Deliver",
          "Payment Done",
        ];

  const handleStatusUpdate = (newStatus) => {
    if (
      !status ||
      statuses.indexOf(newStatus) === statuses.indexOf(status) + 1
    ) {
      setStatus(newStatus);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Customer Info Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Image
              source={require("../assets/images/user2.png")}
              style={styles.avatar}
            />
            <Text style={styles.title}>{task.customer}</Text>
            <TouchableOpacity onPress={callCustomer}>
              <FontAwesome name="phone" size={24} color="#fd7e14" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={20} color="#ff7f00" />
            <Text style={styles.text}>{task.address}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Navigation Button */}
      <TouchableOpacity style={styles.mapButton} onPress={openMaps}>
        <Text style={styles.buttonText}>📍 Navigate to Customer</Text>
      </TouchableOpacity>

      {/* Divider */}
      <Image
        source={require("../assets/images/di-Photoroom.png")}
        style={styles.imageDivider}
      />

      {/* Status Update Section */}
      <Text style={styles.statusTitle}>Update Status</Text>
      {statuses.map((step, index) => (
        <Card
          key={step}
          style={[styles.statusCard, status === step && styles.activeCard]}
        >
          {status === step && (
            <View style={styles.statusIcon}>
              <MaterialIcons name="check-circle" size={24} color="#fff" />
            </View>
          )}
          <TouchableOpacity
            onPress={() => handleStatusUpdate(step)}
            disabled={
              status && statuses.indexOf(step) <= statuses.indexOf(status)
            }
          >
            <Text
              style={[
                styles.cardText,
                status &&
                  statuses.indexOf(step) <= statuses.indexOf(status) &&
                  styles.disabledText,
              ]}
            >
              {step}
            </Text>
          </TouchableOpacity>
        </Card>
      ))}

      {/* Modal for Status Update Confirmation */}
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>Status Updated to: {status}</Text>
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff5e6" },
  card: {
    marginTop: 30,
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  title: { marginRight: 70, fontSize: 24, fontWeight: "700", color: "#565656" },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  text: { fontSize: 18, marginLeft: 5, color: "#565656" },
  mapButton: {
    backgroundColor: "#ff7f00",
    padding: 14,
    borderRadius: 10,
    marginVertical: 15,
    alignItems: "center",
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    color: "#565656",
  },
  statusCard: {
    marginVertical: 8,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  statusIcon: { marginRight: 15 },
  activeCard: {
    backgroundColor: "#ff7f00",
    borderColor: "#e68a00",
    elevation: 5,
  },
  cardText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    color: "#565656",
  },
  disabledText: { color: "#aaa" },
  buttonText: { color: "#fff", fontWeight: "700" },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
    width: "80%",
    elevation: 10,
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
    fontWeight: "600",
  },
  modalButton: { backgroundColor: "#ff7f00", padding: 12, borderRadius: 10 },
  modalButtonText: { color: "#fff", fontWeight: "700" },
  imageDivider: { width: "100%", height: 90, marginVertical: 20 },
});

export default TaskDetailScreen;
