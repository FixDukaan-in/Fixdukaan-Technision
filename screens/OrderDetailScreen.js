import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// Import local images from the assets folder
import sampleImage1 from "../assets/images/image.png";
import sampleImage2 from "../assets/images/image.png";

const TaskDetailsScreen = ({ route }) => {
  const { task } = route.params;
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null); // Track the selected image
  const [modalVisible, setModalVisible] = useState(false); // Control modal visibility

  // Local images array
  const images = [sampleImage1, sampleImage2];

  // Handle Accept Button Click
  const handleAccept = () => {
    navigation.navigate("TaskDetailScreen", { task }); // Navigating to TaskDetailsScreen
  };

  // Handle Decline Button Click (Modify as needed)
  const handleDecline = () => {
    alert("Task Declined");
  };

  // Open the modal with the selected image
  const openImageModal = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  // Close the modal
  const closeImageModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>📌 Order Details</Text>

        {/* Task Details */}
        <View style={styles.card}>
          <Text style={styles.detailText}>
            <Text style={styles.bold}>👤 Customer:</Text> {task.customer}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.bold}>📱 Device:</Text> {task.device} (
            {task.brand})
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.bold}>⚠️ Issue:</Text> {task.issue}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.bold}>📍 Address:</Text> {task.address}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.bold}>🕒 Schedule:</Text> {task.date} |{" "}
            {task.timeSlot}
          </Text>
        </View>

        {/* Uploaded Images */}
        <Text style={styles.imageTitle}>🖼️ Uploaded Images</Text>
        <FlatList
          data={images}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openImageModal(item)}>
              <Image source={item} style={styles.image} />
            </TouchableOpacity>
          )}
        />
      </ScrollView>

      {/* Accept & Decline Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
          <Text style={styles.buttonText}>✅ Accept</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.declineButton} onPress={handleDecline}>
          <Text style={styles.buttonText}>❌ Decline</Text>
        </TouchableOpacity>
      </View>

      {/* Image Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={closeImageModal}
      >
        <TouchableWithoutFeedback onPress={closeImageModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Image source={selectedImage} style={styles.fullImage} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff5e6", // Orange theme background
  },
  scrollContainer: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#575757",
    textAlign: "center",
    marginBottom: 15,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
    marginTop: 30,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    color: "#444",
    marginBottom: 8,
  },
  bold: {
    fontWeight: "bold",
    color: "#fd7e14",
  },
  imageTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#575757",
    marginBottom: 15,
    textAlign: "center",
  },
  image: {
    width: 150,
    height: 150,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  acceptButton: {
    backgroundColor: "#28a745", // Green for accept
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  declineButton: {
    backgroundColor: "#dc3545", // Red for decline
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    width: "90%",
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});

export default TaskDetailsScreen;
