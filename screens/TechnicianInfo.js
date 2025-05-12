import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/MaterialIcons";

const TechnicianDetailScreen = ({ route, navigation }) => {
  const { technician, locationId } = route.params;
  const [selectedTechnician, setSelectedTechnician] = useState({
    ...technician,
    documents: technician.documents || [
      { id: 1, type: "Aadhaar Card", uri: "https://example.com/aadhaar.jpg" },
      { id: 2, type: "PAN Card", uri: "https://example.com/pan.jpg" },
      { id: 3, type: "Bank Proof", uri: "https://example.com/bank.jpg" },
    ],
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Function to handle suspending/resuming a technician
  const handleSuspendResumeTechnician = () => {
    const newStatus = !selectedTechnician.isSuspended;

    Alert.alert(
      newStatus ? "Suspend Technician" : "Resume Technician",
      `Are you sure you want to ${newStatus ? "suspend" : "resume"} ${
        selectedTechnician.name
      }?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            setSelectedTechnician((prev) => ({
              ...prev,
              isSuspended: newStatus,
              suspensionDates: newStatus
                ? { start: selectedStartDate, end: selectedEndDate }
                : null,
            }));
            setSelectedStartDate(null);
            setSelectedEndDate(null);
            setShowCalendar(false);

            Alert.alert(
              "Success",
              `${selectedTechnician.name} has been ${
                newStatus ? "suspended" : "resumed"
              }${
                newStatus
                  ? ` from ${selectedStartDate} to ${selectedEndDate}`
                  : ""
              }.`
            );
          },
        },
      ]
    );
  };

  // Function to verify technician
  const handleVerifyTechnician = () => {
    Alert.alert(
      "Verify Technician",
      `Are you sure you want to verify ${selectedTechnician.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Verify",
          onPress: () => {
            setSelectedTechnician((prev) => ({
              ...prev,
              isVerified: true,
              verificationDate: new Date().toISOString().split("T")[0],
            }));
            Alert.alert(
              "Success",
              `${selectedTechnician.name} has been verified.`
            );
          },
        },
      ]
    );
  };

  // Function to calculate average rating and render stars
  const renderRatingStars = (ratings) => {
    const avgRating = ratings.length
      ? (ratings.reduce((acc, r) => acc + r, 0) / ratings.length).toFixed(1)
      : 0;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          name={i <= avgRating ? "star" : "star-border"}
          size={20}
          color="#ffd700"
        />
      );
    }
    return (
      <View style={styles.ratingContainer}>
        {stars}
        <Text style={styles.ratingText}>{avgRating}</Text>
      </View>
    );
  };

  // Function to handle date selection
  const handleDateSelect = (date) => {
    if (!selectedStartDate) {
      setSelectedStartDate(date.dateString);
    } else if (!selectedEndDate && date.dateString > selectedStartDate) {
      setSelectedEndDate(date.dateString);
    } else {
      setSelectedStartDate(date.dateString);
      setSelectedEndDate(null);
    }
  };

  // Function to generate marked dates for the calendar
  const getMarkedDates = () => {
    const markedDates = {};
    const suspendColor = "#fd7e14";

    if (selectedStartDate) {
      markedDates[selectedStartDate] = {
        startingDay: true,
        color: suspendColor,
        textColor: "#fff",
      };
    }

    if (selectedEndDate) {
      markedDates[selectedEndDate] = {
        endingDay: true,
        color: suspendColor,
        textColor: "#fff",
      };
    }

    if (selectedStartDate && selectedEndDate) {
      const start = new Date(selectedStartDate);
      const end = new Date(selectedEndDate);
      let currentDate = new Date(start);

      while (currentDate <= end) {
        const dateString = currentDate.toISOString().split("T")[0];
        if (
          dateString !== selectedStartDate &&
          dateString !== selectedEndDate
        ) {
          markedDates[dateString] = {
            color: suspendColor + "50",
            textColor: "#fff",
          };
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return markedDates;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.title}>{selectedTechnician.name}</Text>
            {selectedTechnician.isVerified && (
              <View style={styles.verifiedBadge}>
                <Icon name="verified" size={18} color="#28a745" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
          <View style={styles.detailRow}>
            <Icon
              name={selectedTechnician.gender === "Male" ? "man" : "woman"}
              size={18}
              color="#575757"
            />
            <Text style={styles.headerText}>
              {selectedTechnician.gender} | Age: {selectedTechnician.age}
            </Text>
          </View>
          {selectedTechnician.isVerified && (
            <View style={styles.detailRow}>
              <Icon name="verified-user" size={18} color="#28a745" />
              <Text style={styles.headerText}>
                Verified on: {selectedTechnician.verificationDate}
              </Text>
            </View>
          )}
        </View>

        {/* Contact Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Information</Text>
          <View style={styles.detailRow}>
            <Icon name="phone" size={18} color="#666" />
            <Text style={styles.detailText}>
              Number: {selectedTechnician.number}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="email" size={18} color="#666" />
            <Text style={styles.detailText}>
              Email: {selectedTechnician.email || "Not provided"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="location-on" size={18} color="#666" />
            <Text style={styles.detailText}>
              Address: {selectedTechnician.address}
            </Text>
          </View>
        </View>

        {/* Identification Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Identification</Text>
          <View style={styles.detailRow}>
            <Icon name="credit-card" size={18} color="#666" />
            <Text style={styles.detailText}>
              Aadhaar: {selectedTechnician.aadhaarNumber}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="account-balance" size={18} color="#666" />
            <Text style={styles.detailText}>
              Account: {selectedTechnician.accountNumber}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="code" size={18} color="#666" />
            <Text style={styles.detailText}>
              IFSC: {selectedTechnician.ifscCode}
            </Text>
          </View>
        </View>

        {/* Documents Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Documents</Text>
          {selectedTechnician.documents.map((doc) => (
            <TouchableOpacity
              key={doc.id}
              style={styles.documentItem}
              onPress={() => {
                setSelectedDocument(doc.uri);
                setModalVisible(true);
              }}
            >
              <Icon name="description" size={20} color="#666" />
              <Text style={styles.documentText}>{doc.type}</Text>
              <Icon name="chevron-right" size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Performance Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Performance</Text>
          <View style={styles.detailRow}>
            {renderRatingStars(selectedTechnician.ratings)}
          </View>
          <View style={styles.detailRow}>
            <Icon name="work" size={18} color="#666" />
            <Text style={styles.detailText}>
              Jobs Completed: {selectedTechnician.jobsCompleted || 0}
            </Text>
          </View>
          {selectedTechnician.isSuspended && (
            <View style={styles.detailRow}>
              <Icon name="block" size={18} color="#666" />
              <Text style={styles.detailText}>
                Suspended: {selectedTechnician.suspensionDates?.start} to{" "}
                {selectedTechnician.suspensionDates?.end}
              </Text>
            </View>
          )}
        </View>

        {/* Calendar Section */}
        {showCalendar && (
          <View style={styles.calendarCard}>
            <Text style={styles.cardTitle}>Select Suspension Dates</Text>
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={getMarkedDates()}
              markingType={"period"}
              theme={{
                selectedDayBackgroundColor: "#fd7e14",
                todayTextColor: "#fd7e14",
                arrowColor: "#fd7e14",
              }}
            />
            <View style={styles.selectedDatesContainer}>
              {selectedStartDate && (
                <Text style={styles.selectedDateText}>
                  From: {selectedStartDate}
                </Text>
              )}
              {selectedEndDate && (
                <Text style={styles.selectedDateText}>
                  To: {selectedEndDate}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                if (!selectedStartDate || !selectedEndDate) {
                  Alert.alert(
                    "Error",
                    "Please select both start and end dates."
                  );
                  return;
                }
                handleSuspendResumeTechnician();
              }}
            >
              <Text style={styles.confirmButtonText}>Confirm Suspension</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {!selectedTechnician.isVerified && (
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={handleVerifyTechnician}
            >
              <Icon name="verified" size={20} color="#fff" />
              <Text style={styles.buttonText}>Verify Technician</Text>
            </TouchableOpacity>
          )}

          {!showCalendar && (
            <TouchableOpacity
              style={[
                selectedTechnician.isSuspended
                  ? styles.resumeButton
                  : styles.suspendButton,
                styles.actionButton,
              ]}
              onPress={() => {
                if (selectedTechnician.isSuspended) {
                  handleSuspendResumeTechnician();
                } else {
                  setShowCalendar(true);
                }
              }}
            >
              <Icon
                name={selectedTechnician.isSuspended ? "play-arrow" : "pause"}
                size={20}
                color="#fff"
              />
              <Text style={styles.buttonText}>
                {selectedTechnician.isSuspended
                  ? "Resume Service"
                  : "Suspend Service"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Document Viewer Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Image
                source={{ uri: selectedDocument }}
                style={styles.documentImage}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Icon name="close" size={24} color="#fff" />
              </TouchableOpacity>
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
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  headerCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    color: "#28a745",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  headerText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
    flex: 1,
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  documentText: {
    flex: 1,
    fontSize: 16,
    color: "#666",
    marginLeft: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  calendarCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedDatesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingHorizontal: 8,
  },
  selectedDateText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  confirmButton: {
    marginTop: 16,
    padding: 14,
    backgroundColor: "#fd7e14",
    borderRadius: 8,
    alignItems: "center",
    elevation: 3,
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  verifyButton: {
    flex: 1,
    marginRight: 8,
    padding: 14,
    backgroundColor: "#28a745",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    elevation: 3,
  },
  suspendButton: {
    flex: 1,
    padding: 14,
    backgroundColor: "#fd7e14",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    elevation: 3,
  },
  resumeButton: {
    flex: 1,
    padding: 14,
    backgroundColor: "#007bff",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    elevation: 3,
  },
  actionButton: {
    marginLeft: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    height: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
  },
  documentImage: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TechnicianDetailScreen;
