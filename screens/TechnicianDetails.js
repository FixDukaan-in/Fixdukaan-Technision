import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const TechnicianDetailsScreen = ({ navigation, route }) => {
  const [technicians] = useState([
    {
      id: "fixdukan1",
      location: "FixDukan 1",
      type: "in-house",
      technicians: [
        {
          id: "T-1",
          name: "John Doe",
          gender: "Male",
          number: "1234567890",
          age: 30,
          address: "123 Main St, City, Country",
          aadhaarNumber: "1234 5678 9012",
          accountNumber: "123456789012",
          ifscCode: "ABCD0123456",
          completedOrders: 12,
          isSuspended: false,
          isVerified: true,
          suspensionDates: null,
          ratings: [4, 5, 3, 4, 5],
          workingHoursPerDay: 8,
        },
        {
          id: "T-2",
          name: "Jane Smith",
          gender: "Female",
          number: "0987654321",
          age: 28,
          address: "456 Elm St, City, Country",
          aadhaarNumber: "9876 5432 1098",
          accountNumber: "987654321098",
          ifscCode: "EFGH6543210",
          completedOrders: 10,
          isSuspended: true,
          isVerified: false,
          suspensionDates: { start: "2023-10-01", end: "2023-10-10" },
          ratings: [5, 4, 5, 5],
          workingHoursPerDay: 7,
        },
      ],
    },
    {
      id: "fixdukan2",
      location: "FixDukan 2",
      type: "in-house",
      technicians: [
        {
          id: "T-3",
          name: "Alice Johnson",
          gender: "Female",
          number: "1122334455",
          age: 35,
          address: "789 Oak St, City, Country",
          aadhaarNumber: "1122 3344 5566",
          accountNumber: "112233445566",
          ifscCode: "IJKL1122334",
          completedOrders: 15,
          isSuspended: false,
          isVerified: true,
          suspensionDates: null,
          ratings: [3, 4, 3, 5],
          workingHoursPerDay: 9,
        },
        {
          id: "T-4",
          name: "Bob Brown",
          gender: "Male",
          number: "5566778899",
          age: 40,
          address: "321 Pine St, City, Country",
          aadhaarNumber: "5566 7788 9900",
          accountNumber: "556677889900",
          ifscCode: "MNOP5566778",
          completedOrders: 8,
          isSuspended: false,
          isVerified: false,
          suspensionDates: null,
          ratings: [4, 4, 4, 4],
          workingHoursPerDay: 6,
        },
      ],
    },
    {
      id: "local-techs",
      location: "Local Technicians",
      type: "local",
      technicians: [
        {
          id: "T-5",
          name: "Mike Wilson",
          gender: "Male",
          number: "9988776655",
          age: 32,
          address: "654 Maple St, City, Country",
          aadhaarNumber: "9988 7766 5544",
          accountNumber: "998877665544",
          ifscCode: "QRST9988776",
          completedOrders: 20,
          isSuspended: false,
          isVerified: true,
          suspensionDates: null,
          ratings: [5, 5, 5, 4, 5],
          workingHoursPerDay: 8,
          areaCovered: "North District",
          vehicleNumber: "DL01AB1234",
        },
        {
          id: "T-6",
          name: "Sarah Connor",
          gender: "Female",
          number: "6677889900",
          age: 29,
          address: "987 Cedar St, City, Country",
          aadhaarNumber: "6677 8899 0011",
          accountNumber: "667788990011",
          ifscCode: "UVWX6677889",
          completedOrders: 14,
          isSuspended: false,
          isVerified: true,
          suspensionDates: null,
          ratings: [4, 5, 4, 4, 5],
          workingHoursPerDay: 7,
          areaCovered: "South District",
          vehicleNumber: "DL02CD5678",
        },
      ],
    },
  ]);

  const [filter, setFilter] = useState("all");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [techTypeFilter, setTechTypeFilter] = useState("all");

  useEffect(() => {
    if (route.params?.technicianId) {
      // Find the technician with the matching ID
      let foundTech = null;
      let foundLocation = null;

      for (const location of technicians) {
        foundTech = location.technicians.find(
          (tech) => tech.id === route.params.technicianId
        );
        if (foundTech) {
          foundLocation = location;
          break;
        }
      }

      if (foundTech) {
        navigation.navigate("TechnicianInfo", {
          technician: foundTech,
          locationId: foundLocation.id,
        });
      }
    }
  }, [route.params?.technicianId]);

  // Filter technicians based on selection
  const filteredTechnicians = technicians
    .filter((location) => {
      if (techTypeFilter === "all") return true;
      if (techTypeFilter === "in-house") return location.type === "in-house";
      if (techTypeFilter === "local") return location.type === "local";
      return true;
    })
    .map((location) => ({
      ...location,
      technicians: location.technicians.filter((tech) => {
        if (filter === "all") return true;
        if (filter === "verified") return tech.isVerified;
        if (filter === "notVerified") return !tech.isVerified;
        return true;
      }),
    }))
    .filter((location) => location.technicians.length > 0);

  const renderRatingStars = (ratings) => {
    const avgRating = ratings.length
      ? ratings.reduce((acc, r) => acc + r, 0) / ratings.length
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
        <Text style={styles.ratingText}>{avgRating.toFixed(1)}</Text>
      </View>
    );
  };

  const renderVerificationStatus = (isVerified) => (
    <View style={styles.verificationContainer}>
      <Icon
        name={isVerified ? "verified" : "warning"}
        size={18}
        color={isVerified ? "#4CAF50" : "#F44336"}
      />
      <Text
        style={[
          styles.verificationText,
          { color: isVerified ? "#4CAF50" : "#F44336" },
        ]}
      >
        {isVerified ? "Verified" : "Not Verified"}
      </Text>
    </View>
  );

  const renderTechnicianItem = ({ item, locationId }) => (
    <View style={styles.technicianItem}>
      <View style={styles.nameAndVerification}>
        <Text style={styles.technicianName}>{item.name}</Text>
        {renderVerificationStatus(item.isVerified)}
      </View>
      <View style={styles.detailRow}>
        <Icon name="assignment-turned-in" size={18} color="#666" />
        <Text style={styles.technicianDetails}>
          Completed Orders: {item.completedOrders}
        </Text>
      </View>
      <View style={styles.detailRow}>{renderRatingStars(item.ratings)}</View>
      <View style={styles.detailRow}>
        <Icon name="access-time" size={18} color="#666" />
        <Text style={styles.technicianDetails}>
          Working Hours/Day: {item.workingHoursPerDay}
        </Text>
      </View>
      {item.areaCovered && (
        <View style={styles.detailRow}>
          <Icon name="location-on" size={18} color="#666" />
          <Text style={styles.technicianDetails}>
            Area Covered: {item.areaCovered}
          </Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.viewDetailsButton}
        onPress={() => {
          setSelectedTechnician(item);
          navigation.navigate("TechnicianInfo", {
            technician: item,
            locationId,
          });
        }}
      >
        <Text style={styles.viewDetailsButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLocationGroup = ({ item }) => (
    <View style={styles.locationGroup}>
      <Text style={styles.locationTitle}>
        {item.location}
        {item.type === "local" && (
          <Text style={styles.techTypeBadge}> (Local)</Text>
        )}
        {item.type === "in-house" && (
          <Text style={styles.techTypeBadge}> (In-House)</Text>
        )}
      </Text>
      <FlatList
        data={item.technicians}
        keyExtractor={(technician) => technician.id.toString()}
        renderItem={({ item: technician }) =>
          renderTechnicianItem({ item: technician, locationId: item.id })
        }
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Icon name="filter-list" size={20} color="#fff" />
          <Text style={styles.filterButtonText}>
            {filter === "all"
              ? "All"
              : filter === "verified"
              ? "Verified"
              : "Not Verified"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.techTypeButton,
            techTypeFilter === "all" && styles.techTypeButtonActive,
          ]}
          onPress={() => {
            setTechTypeFilter(
              techTypeFilter === "all"
                ? "in-house"
                : techTypeFilter === "in-house"
                ? "local"
                : "all"
            );
          }}
        >
          <Text style={styles.techTypeButtonText}>
            {techTypeFilter === "all"
              ? "All Techs"
              : techTypeFilter === "in-house"
              ? "In-House"
              : "Local"}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Technicians</Text>
            <TouchableOpacity
              style={[
                styles.filterOption,
                filter === "all" && styles.selectedFilterOption,
              ]}
              onPress={() => {
                setFilter("all");
                setShowFilterModal(false);
              }}
            >
              <Text style={styles.filterOptionText}>All Technicians</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterOption,
                filter === "verified" && styles.selectedFilterOption,
              ]}
              onPress={() => {
                setFilter("verified");
                setShowFilterModal(false);
              }}
            >
              <Text style={styles.filterOptionText}>Verified Only</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterOption,
                filter === "notVerified" && styles.selectedFilterOption,
              ]}
              onPress={() => {
                setFilter("notVerified");
                setShowFilterModal(false);
              }}
            >
              <Text style={styles.filterOptionText}>Not Verified Only</Text>
            </TouchableOpacity>
            <Button
              title="Close"
              onPress={() => setShowFilterModal(false)}
              color="#fd7e14"
            />
          </View>
        </View>
      </Modal>

      {filteredTechnicians.length > 0 ? (
        <FlatList
          data={filteredTechnicians}
          keyExtractor={(location) => location.id}
          renderItem={renderLocationGroup}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyState}>
          <Icon name="info-outline" size={50} color="#666" />
          <Text style={styles.emptyStateText}>
            No technicians match the current filters
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  locationGroup: {
    marginBottom: 20,
  },
  locationTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  techTypeBadge: {
    fontSize: 16,
    color: "#666",
    fontWeight: "normal",
  },
  technicianItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  nameAndVerification: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  technicianName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  verificationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  verificationText: {
    fontSize: 14,
    marginLeft: 4,
    fontWeight: "500",
  },
  technicianDetails: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
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
  viewDetailsButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#fd7e14",
    borderRadius: 8,
    alignItems: "center",
  },
  viewDetailsButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fd7e14",
    padding: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  techTypeButton: {
    backgroundColor: "#fd7e14",
    padding: 10,
    borderRadius: 8,
  },
  techTypeButtonActive: {
    backgroundColor: "#fd7e14",
  },
  techTypeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  filterButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  filterOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedFilterOption: {
    backgroundColor: "#f5f5f5",
  },
  filterOptionText: {
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default TechnicianDetailsScreen;
