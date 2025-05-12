import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Linking,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

// Mock data for all complaints (replace with API call if needed)
const allComplaints = [
  {
    id: "C-101",
    date: "2023-10-16",
    issue: "Screen has minor scratches",
    status: "Resolved",
    customerName: "John Doe",
    complaintText: "Screen has minor scratches after repair",
    adminReply: "We've addressed this with the technician",
    orderId: "1",
    technician: {
      id: "T-1245",
      name: "Mike Johnson",
      phone: "+91 9876543210",
      rating: 4.2,
      experience: "3 years",
      specialization: "Mobile Repair",
    },
  },
  {
    id: "C-102",
    date: "2023-10-19",
    issue: "Phone case doesn't fit properly after repair",
    status: "Pending",
    customerName: "Emily Wilson",
    complaintText: "Phone case doesn't fit properly after repair",
    orderId: "4",
    technician: {
      id: "T-1245",
      name: "Mike Johnson",
      phone: "+91 9876543210",
      rating: 4.2,
      experience: "3 years",
      specialization: "Mobile Repair",
    },
  },
];

const ComplaintScreen = ({ route, navigation }) => {
  const {
    complaints: initialComplaints = [],
    orderId,
    complaintId,
  } = route.params || {};

  // Initialize complaints: use initialComplaints if provided, else allComplaints
  const [complaints, setComplaints] = useState(
    initialComplaints.length > 0 ? initialComplaints : allComplaints
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [adminReply, setAdminReply] = useState("");
  const [techModalVisible, setTechModalVisible] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [highlightedComplaint, setHighlightedComplaint] = useState(null);

  // Update navigation title
  useEffect(() => {
    navigation.setOptions({
      title: orderId ? `Complaints for Order #${orderId}` : "All Complaints",
    });
  }, [orderId, navigation]);

  // Highlight specific complaint if complaintId is provided
  useEffect(() => {
    if (complaintId && complaints.length > 0) {
      const complaintToHighlight = complaints.find((c) => c.id === complaintId);
      if (complaintToHighlight) {
        setHighlightedComplaint(complaintToHighlight);
        setTimeout(() => {
          if (flatListRef.current && complaintToHighlight) {
            const index = complaints.findIndex(
              (c) => c.id === complaintToHighlight.id
            );
            if (index >= 0) {
              flatListRef.current.scrollToIndex({ index, animated: true });
            }
          }
        }, 500);
      }
    }
  }, [complaintId, complaints]);

  const flatListRef = React.useRef();

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate data refresh (replace with API call if needed)
    setTimeout(() => {
      setComplaints(
        initialComplaints.length > 0 ? initialComplaints : allComplaints
      );
      setRefreshing(false);
    }, 1000);
  };

  const handleReply = () => {
    if (!adminReply.trim()) {
      Alert.alert("Error", "Please enter a reply.");
      return;
    }

    const updatedComplaints = complaints.map((complaint) =>
      complaint.id === selectedComplaint.id
        ? { ...complaint, status: "Resolved", adminReply }
        : complaint
    );

    setComplaints(updatedComplaints);
    Alert.alert("Success", "Complaint resolved successfully.");
    setModalVisible(false);
    setAdminReply("");
  };

  const showTechnicianDetails = (technician) => {
    if (technician) {
      setSelectedTechnician(technician);
      setTechModalVisible(true);
    }
  };

  // Filter complaints based on search and status
  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.customerName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      complaint.complaintText
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || complaint.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const renderComplaintItem = ({ item }) => (
    <View
      style={[
        styles.complaintItem,
        highlightedComplaint?.id === item.id && styles.highlightedComplaint,
      ]}
    >
      <View style={styles.complaintHeader}>
        <Text style={styles.customerName}>{item.customerName}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>

      <View style={styles.detailRow}>
        <Icon name="report-problem" size={18} color="#666" />
        <Text style={styles.complaintText}>{item.complaintText}</Text>
      </View>

      {item.orderId && (
        <View style={styles.detailRow}>
          <Icon name="receipt" size={18} color="#666" />
          <Text style={styles.orderText}>Order #{item.orderId}</Text>
        </View>
      )}

      {item.technician && (
        <TouchableOpacity
          style={styles.techInfoContainer}
          onPress={() => showTechnicianDetails(item.technician)}
        >
          <View style={styles.detailRow}>
            <Icon name="person" size={18} color="#666" />
            <Text style={styles.techText}>
              Technician: {item.technician.name}
            </Text>
            <Icon name="chevron-right" size={18} color="#666" />
          </View>
        </TouchableOpacity>
      )}

      <View style={styles.detailRow}>
        <Icon
          name={item.status === "Resolved" ? "check-circle" : "hourglass-empty"}
          size={18}
          color={item.status === "Resolved" ? "#28a745" : "#fd7e14"}
        />
        <Text
          style={[
            styles.statusText,
            { color: item.status === "Resolved" ? "#28a745" : "#fd7e14" },
          ]}
        >
          {item.status}
        </Text>
      </View>

      {item.adminReply && (
        <View style={styles.detailRow}>
          <Icon name="reply" size={18} color="#666" />
          <Text style={styles.replyText}>{item.adminReply}</Text>
        </View>
      )}

      {item.status === "Pending" && (
        <TouchableOpacity
          style={styles.replyButton}
          onPress={() => {
            setSelectedComplaint(item);
            setModalVisible(true);
          }}
        >
          <Text style={styles.replyButtonText}>Reply</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search and Filter Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search complaints..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.filterContainer}>
          <Icon name="filter-list" size={20} color="#666" />
          <Text style={styles.filterLabel}>Status:</Text>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {
              setFilterStatus((prev) =>
                prev === "All"
                  ? "Pending"
                  : prev === "Pending"
                  ? "Resolved"
                  : "All"
              );
            }}
          >
            <Text style={styles.filterText}>{filterStatus}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={filteredComplaints}
        keyExtractor={(item) => item.id}
        renderItem={renderComplaintItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="info-outline" size={40} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery || filterStatus !== "All"
                ? "No matching complaints found"
                : "No complaints available"}
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#fd7e14"]}
            tintColor="#fd7e14"
          />
        }
        onScrollToIndexFailed={(info) => {
          const wait = new Promise((resolve) => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
            });
          });
        }}
      />

      {/* Reply Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setModalVisible(false)}
            >
              <Icon name="close" size={30} color="#333" />
            </TouchableOpacity>

            {selectedComplaint && (
              <>
                <Text style={styles.modalTitle}>
                  Reply to {selectedComplaint.customerName}
                </Text>

                <View style={styles.detailRow}>
                  <Icon name="report-problem" size={18} color="#666" />
                  <Text style={styles.modalText}>
                    {selectedComplaint.complaintText}
                  </Text>
                </View>

                {selectedComplaint.orderId && (
                  <View style={styles.detailRow}>
                    <Icon name="receipt" size={18} color="#666" />
                    <Text style={styles.modalText}>
                      Order #{selectedComplaint.orderId}
                    </Text>
                  </View>
                )}

                {selectedComplaint.technician && (
                  <View style={styles.detailRow}>
                    <Icon name="person" size={18} color="#666" />
                    <Text style={styles.modalText}>
                      Technician: {selectedComplaint.technician.name}
                    </Text>
                  </View>
                )}

                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your reply..."
                  value={adminReply}
                  onChangeText={setAdminReply}
                  multiline
                />

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleReply}
                >
                  <Text style={styles.submitButtonText}>Submit Reply</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Technician Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={techModalVisible}
        onRequestClose={() => setTechModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setTechModalVisible(false)}
            >
              <Icon name="close" size={30} color="#333" />
            </TouchableOpacity>

            {selectedTechnician && (
              <>
                <Text style={styles.modalTitle}>Technician Details</Text>

                <View style={styles.techDetailRow}>
                  <Icon name="person" size={20} color="#666" />
                  <Text style={styles.techDetailText}>
                    Name: {selectedTechnician.name}
                  </Text>
                </View>

                <View style={styles.techDetailRow}>
                  <Icon name="phone" size={20} color="#666" />
                  <Text style={styles.techDetailText}>
                    Phone: {selectedTechnician.phone}
                  </Text>
                </View>

                <View style={styles.techDetailRow}>
                  <Icon name="star" size={20} color="#666" />
                  <Text style={styles.techDetailText}>
                    Rating: {selectedTechnician.rating}/5
                  </Text>
                </View>

                <View style={styles.techDetailRow}>
                  <Icon name="work" size={20} color="#666" />
                  <Text style={styles.techDetailText}>
                    Experience: {selectedTechnician.experience}
                  </Text>
                </View>

                <View style={styles.techDetailRow}>
                  <Icon name="build" size={20} color="#666" />
                  <Text style={styles.techDetailText}>
                    Specialization: {selectedTechnician.specialization}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={() =>
                    Linking.openURL(`tel:${selectedTechnician.phone}`)
                  }
                >
                  <Text style={styles.contactButtonText}>Call Technician</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    margin: 16,
    marginBottom: 10,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: "#ddd",
  },
  filterLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
    marginRight: 5,
  },
  filterButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#eee",
    borderRadius: 4,
  },
  filterText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
  complaintItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  highlightedComplaint: {
    borderLeftWidth: 4,
    borderLeftColor: "#fd7e14",
    backgroundColor: "#fff8e6",
  },
  complaintHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  complaintText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    flex: 1,
  },
  orderText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
  },
  techInfoContainer: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
  },
  techText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  statusText: {
    fontSize: 14,
    marginLeft: 8,
  },
  replyText: {
    fontSize: 14,
    color: "#28a745",
    marginLeft: 8,
    flex: 1,
  },
  replyButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#fd7e14",
    borderRadius: 8,
    alignItems: "center",
  },
  replyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    elevation: 5,
    position: "relative",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
    flex: 1,
  },
  techDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  techDetailText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    padding: 12,
    backgroundColor: "#28a745",
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  contactButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#007bff",
    borderRadius: 8,
    alignItems: "center",
  },
  contactButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

export default ComplaintScreen;
