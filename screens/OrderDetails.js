import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const OrdersScreen = () => {
  const navigation = useNavigation();
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);

  const orders = [
    {
      id: 1,
      name: "John Doe",
      phoneNumber: "123-456-7890",
      address: "123 Main St, City, Country",
      issue: "Screen not working",
      deviceName: "iPhone 12",
      scheduleTime: "2023-10-15 | 10:00 AM",
      cost: 100,
      status: "Completed",
      serviceType: "At Home Repair",
      trackingStatus: null,
      repairsDone: "Screen replacement, battery check",
      partsUsed: "Original OLED screen",
      technician: "Mike Johnson (Local) (Tech ID: T-1245)",
      paymentMethod: "Credit Card",
      warranty: "90 days on screen replacement",
      notes: "Customer requested screen protector installation",
      reviews: {
        productRating: 5,
        productDescription: "The screen looks brand new!",
        technicianRating: 4,
        technicianDescription: "Technician was very professional.",
        appRating: 5,
        appDescription: "The app is easy to use.",
      },
      complaints: [
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
      ],
    },
    {
      id: 2,
      name: "Jane Smith",
      phoneNumber: "987-654-3210",
      address: "456 Elm St, City, Country",
      issue: "Battery replacement",
      deviceName: "Samsung Galaxy S21",
      scheduleTime: "2023-10-16 | 02:00 PM",
      cost: 80,
      status: "Ongoing",
      serviceType: "Pickup & Drop",
      trackingStatus: "Cost Verification",
      repairsDone: "Battery diagnostics",
      partsUsed: "Genuine Samsung battery (pending approval)",
      technician: "Sarah Williams (In-House) (Tech ID: T-1357)",
      paymentMethod: null,
      warranty: null,
      notes: "Customer will confirm after cost approval",
      reviews: null,
      complaints: [],
    },
    {
      id: 3,
      name: "Robert Johnson",
      phoneNumber: "555-123-4567",
      address: "789 Oak Ave, City, Country",
      issue: "Water damage",
      deviceName: "Google Pixel 6",
      scheduleTime: "2023-10-17 | 11:30 AM",
      cost: 120,
      status: "Pending",
      serviceType: "At Home Repair",
      trackingStatus: "NA",
      repairsDone: "Initial assessment",
      partsUsed: "None yet",
      technician: "Not Assigned",
      paymentMethod: null,
      warranty: null,
      notes: "Customer reported phone fell in water yesterday",
      reviews: null,
      complaints: [],
    },
    {
      id: 4,
      name: "Emily Wilson",
      phoneNumber: "444-555-6666",
      address: "321 Pine Rd, City, Country",
      issue: "Charging port not working",
      deviceName: "iPhone 13 Pro",
      scheduleTime: "2023-10-18 | 03:15 PM",
      cost: 65,
      status: "Completed",
      serviceType: "Pickup & Drop",
      trackingStatus: null,
      repairsDone: "Charging port replacement, cleaning",
      partsUsed: "Original charging port",
      technician: "Lisa Taylor (In-House) (Tech ID: T-1567)",
      paymentMethod: "PayPal",
      warranty: "60 days on charging port",
      notes: "Customer very satisfied with service",
      reviews: {
        productRating: 5,
        productDescription: "Works perfectly now!",
        technicianRating: 5,
        technicianDescription: "Excellent service, very punctual.",
        appRating: 4,
        appDescription: "App could use more tracking features.",
      },
      complaints: [
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
      ],
    },
    {
      id: 5,
      name: "Michael Brown",
      phoneNumber: "777-888-9999",
      address: "654 Maple Blvd, City, Country",
      issue: "Back glass cracked",
      deviceName: "Samsung Galaxy S22 Ultra",
      scheduleTime: "2023-10-20 | 09:45 AM",
      cost: 150,
      status: "Completed",
      serviceType: "At Home Repair",
      trackingStatus: null,
      repairsDone: "Back glass replacement, camera check",
      partsUsed: "OEM back glass",
      technician: "James Wilson (Local) (Tech ID: T-1632)",
      paymentMethod: "Cash",
      warranty: "90 days on parts and labor",
      notes: "Customer requested same-day service",
      reviews: {
        productRating: 4,
        productDescription: "Looks good but color is slightly off",
        technicianRating: 5,
        technicianDescription: "Technician tone",
        appRating: 5,
        appDescription: "Love the app interface.",
      },
      complaints: [],
    },
  ];

  const statusOptions = ["All", "Completed", "Ongoing", "Pending"];

  const filteredOrders = orders.filter((order) => {
    const statusMatch =
      selectedStatus === "All" || order.status === selectedStatus;
    const searchMatch =
      order.id.toString().includes(searchQuery) ||
      order.name.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  const StarRating = ({ rating }) => {
    return (
      <View style={styles.starRatingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? "star" : "star-outline"}
            size={20}
            color="#fd7e14"
          />
        ))}
      </View>
    );
  };

  const DetailRow = ({ icon, text }) => (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={18} color="#666" />
      <Text style={styles.detailText}>{text}</Text>
    </View>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "#28a745";
      case "Ongoing":
        return "#007bff";
      case "Pending":
        return "#dc3545";
      default:
        return "#666";
    }
  };

  const getServiceTypeColor = (type) => {
    switch (type) {
      case "At Home Repair":
        return "#4CAF50";
      case "Pickup & Drop":
        return "#2196F3";
      default:
        return "#666";
    }
  };

  const handleViewComplaints = (order, complaintId = null) => {
    navigation.navigate("Complaints", {
      orderId: order.id,
      complaints: order.complaints || [],
      complaintId, // Optional: highlight a specific complaint
    });
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <View style={styles.badgeContainer}>
        <Text
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          {item.status}
        </Text>
        <Text
          style={[
            styles.serviceBadge,
            { backgroundColor: getServiceTypeColor(item.serviceType) },
          ]}
        >
          {item.serviceType}
        </Text>
      </View>

      <DetailRow icon="person" text={`Name: ${item.name}`} />
      <DetailRow icon="call" text={`Phone: ${item.phoneNumber}`} />
      <DetailRow icon="location" text={`Address: ${item.address}`} />
      <DetailRow icon="calendar" text={`Date: ${item.scheduleTime}`} />
      <DetailRow icon="alert-circle" text={`Issue: ${item.issue}`} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => navigation.navigate("OrderDetail", { order: item })}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>

        {item.status === "Completed" && item.reviews && (
          <TouchableOpacity
            style={styles.reviewsButton}
            onPress={() => {
              setSelectedOrder(item);
              setShowReviewsModal(true);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>View Reviews</Text>
          </TouchableOpacity>
        )}

        {item.complaints && item.complaints.length > 0 && (
          <TouchableOpacity
            style={styles.complaintsButton}
            onPress={() => handleViewComplaints(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>View Complaints</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderReviewsModal = () => (
    <Modal
      visible={showReviewsModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowReviewsModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>Customer Reviews</Text>
            <Text style={styles.reviewSubtitle}>
              Order #{selectedOrder?.id}
            </Text>

            <View style={styles.reviewSection}>
              <Text style={styles.reviewCategory}>Product After Repair</Text>
              <StarRating rating={selectedOrder?.reviews?.productRating || 0} />
              <Text style={styles.reviewText}>
                {selectedOrder?.reviews?.productDescription ||
                  "No review provided"}
              </Text>
            </View>

            <View style={styles.reviewSection}>
              <Text style={styles.reviewCategory}>Technician Service</Text>
              <StarRating
                rating={selectedOrder?.reviews?.technicianRating || 0}
              />
              <Text style={styles.reviewText}>
                {selectedOrder?.reviews?.technicianDescription ||
                  "No review provided"}
              </Text>
            </View>

            <View style={styles.reviewSection}>
              <Text style={styles.reviewCategory}>App Experience</Text>
              <StarRating rating={selectedOrder?.reviews?.appRating || 0} />
              <Text style={styles.reviewText}>
                {selectedOrder?.reviews?.appDescription || "No review provided"}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowReviewsModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header and search bar */}
      <View style={styles.headerContainer}>
        <Ionicons name="list" size={30} color="#fd7e14" />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Total Orders: {orders.length}</Text>
          <Text style={styles.headerSubtitle}>
            Showing: {filteredOrders.length} orders
          </Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Order ID or Name"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Status Filter Dropdown */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowStatusFilter(!showStatusFilter)}
          activeOpacity={0.7}
        >
          <Text style={styles.filterButtonText}>Status: {selectedStatus}</Text>
          <Ionicons
            name={showStatusFilter ? "chevron-up" : "chevron-down"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>

        {showStatusFilter && (
          <View style={styles.filterDropdown}>
            {statusOptions.map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterOption,
                  selectedStatus === status && styles.selectedFilterOption,
                ]}
                onPress={() => {
                  setSelectedStatus(status);
                  setShowStatusFilter(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.filterOptionText}>{status}</Text>
                {selectedStatus === status && (
                  <Ionicons name="checkmark" size={18} color="#fd7e14" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Order List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.orderList}
        ListEmptyComponent={
          <View style={styles.emptyStateContainer}>
            <Ionicons name="list-outline" size={50} color="#ccc" />
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? "No orders found"
                : "No orders match the selected filters"}
            </Text>
          </View>
        }
      />

      {/* Reviews Modal */}
      {renderReviewsModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTextContainer: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
  },
  filterContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    position: "relative",
    zIndex: 1,
  },
  filterButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  filterDropdown: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    paddingVertical: 8,
  },
  filterOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  selectedFilterOption: {
    backgroundColor: "#f8f8f8",
  },
  filterOptionText: {
    fontSize: 16,
    color: "#333",
  },
  orderList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  orderItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#fd7e14",
  },
  badgeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  serviceBadge: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    flexWrap: "wrap",
  },
  detailsButton: {
    padding: 12,
    backgroundColor: "#fd7e14",
    borderRadius: 8,
    margin: 4,
    flex: 1,
    minWidth: "30%",
    alignItems: "center",
  },
  reviewsButton: {
    padding: 12,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    margin: 4,
    flex: 1,
    minWidth: "30%",
    alignItems: "center",
  },
  complaintsButton: {
    padding: 12,
    backgroundColor: "#dc3545",
    borderRadius: 8,
    margin: 4,
    flex: 1,
    minWidth: "30%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    padding: 16,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    maxHeight: "80%",
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  reviewSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  reviewSection: {
    marginBottom: 20,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 16,
  },
  reviewCategory: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  reviewText: {
    fontSize: 14,
    color: "#333",
    marginTop: 8,
  },
  starRatingContainer: {
    flexDirection: "row",
    marginVertical: 5,
  },
  closeButton: {
    padding: 12,
    backgroundColor: "#fd7e14",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default OrdersScreen;
