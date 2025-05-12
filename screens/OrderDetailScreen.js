import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const OrderDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { order } = route.params;

  // Determine technician type
  const isLocalTechnician = order.technician?.includes("(Local)");
  const isInHouseTechnician = order.technician?.includes("(In-House)");

  const DetailRow = ({
    icon,
    iconColor = "#666",
    text,
    amount,
    isBold = false,
  }) => (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={18} color={iconColor} />
      <Text style={styles.detailText}>
        {text}
        {amount && (
          <Text style={[styles.amountText, isBold && styles.boldText]}>
            {amount}
          </Text>
        )}
      </Text>
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

  const handleViewTechnician = () => {
    if (order.technician) {
      const techIdMatch = order.technician.match(/Tech ID: (T-\d+)/);
      if (techIdMatch?.[1]) {
        navigation.navigate("Technicians", {
          screen: "TechnicianList",
          params: { technicianId: techIdMatch[1] },
        });
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Order #{order.id}</Text>
        <View style={styles.badgeContainer}>
          <Text
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(order.status) },
            ]}
          >
            {order.status}
          </Text>
          <Text
            style={[
              styles.serviceBadge,
              { backgroundColor: getServiceTypeColor(order.serviceType) },
            ]}
          >
            {order.serviceType}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Service Information</Text>
        <DetailRow
          icon="construct"
          iconColor="#Fd7e14"
          text={`Service Type: ${order.serviceType}`}
        />
        <DetailRow
          icon="information-circle"
          iconColor="#Fd7e14"
          text={`Status: ${order.status}`}
        />
        {order.trackingStatus && (
          <DetailRow
            icon="time"
            iconColor="#Fd7e14"
            text={`Tracking: ${order.trackingStatus}`}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        <DetailRow
          icon="person"
          iconColor="#Fd7e14"
          text={`Name: ${order.name}`}
        />
        <DetailRow
          icon="call"
          iconColor="#Fd7e14"
          text={`Phone: ${order.phoneNumber}`}
        />
        <DetailRow
          icon="location"
          iconColor="#Fd7e14"
          text={`Address: ${order.address}`}
        />
        <DetailRow
          icon="calendar"
          iconColor="#Fd7e14"
          text={`Scheduled: ${order.scheduleTime}`}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device Information</Text>
        <DetailRow
          icon="phone-portrait"
          iconColor="#Fd7e14"
          text={`Device: ${order.deviceName}`}
        />
        <DetailRow
          icon="alert-circle"
          iconColor="#Fd7e14"
          text={`Issue: ${order.issue}`}
        />
      </View>

      {order.technician && order.status !== "Pending" && (
        <View style={[styles.section, styles.technicianSection]}>
          <Text style={styles.sectionTitle}>Assigned Technician</Text>
          <DetailRow
            icon="person-circle"
            iconColor="#Fd7e14"
            text={order.technician.replace(/\s*\(Local\)|\s*\(In-House\)/g, "")}
          />
          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={handleViewTechnician}
          >
            <Text style={styles.viewDetailsText}>View Technician Details</Text>
            <Ionicons name="arrow-forward" size={18} color="#fd7e14" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Repair Details</Text>
        <DetailRow
          icon="build"
          iconColor="#Fd7e14"
          text={`Repairs Done: ${order.repairsDone || "Pending"}`}
        />
        <DetailRow
          icon="hammer"
          iconColor="#Fd7e14"
          text={`Parts Used: ${order.partsUsed || "Pending"}`}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cost Breakdown</Text>

        {isLocalTechnician ? (
          <>
            <DetailRow
              icon="cash"
              iconColor="#Fd7e14"
              text="Technician's Cost: "
              amount={`$${order.technicianCost?.toFixed(2) || "0.00"}`}
            />
            <DetailRow
              icon="cash"
              iconColor="#Fd7e14"
              text="Service Fee: "
              amount={`$${order.serviceFee?.toFixed(2) || "0.00"}`}
            />
            <DetailRow
              icon="cash"
              iconColor="#Fd7e14"
              text="Final Cost to Customer: "
              amount={`$${order.finalCost?.toFixed(2) || "0.00"}`}
              isBold={true}
            />
          </>
        ) : isInHouseTechnician ? (
          <>
            <DetailRow
              icon="cash"
              iconColor="#Fd7e14"
              text="Our Cost: "
              amount={`$${order.ourCost?.toFixed(2) || "0.00"}`}
            />
            <DetailRow
              icon="cash"
              iconColor="#Fd7e14"
              text="Final Cost to Customer: "
              amount={`$${order.finalCost?.toFixed(2) || "0.00"}`}
              isBold={true}
            />
          </>
        ) : (
          <DetailRow
            icon="cash"
            iconColor="#Fd7e14"
            text="Total Cost: "
            amount={`$${order.cost?.toFixed(2) || "0.00"}`}
          />
        )}
      </View>

      {order.paymentMethod && (
        <DetailRow
          icon="card"
          iconColor="#Fd7e14"
          text={`Payment Method: ${order.paymentMethod}`}
        />
      )}

      {order.warranty && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Warranty Information</Text>
          <DetailRow
            icon="shield-checkmark"
            iconColor="#Fd7e14"
            text={order.warranty}
          />
        </View>
      )}

      {order.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>
          <DetailRow
            icon="document-text"
            iconColor="#Fd7e14"
            text={order.notes}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  badgeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  statusBadge: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginRight: 8,
  },
  serviceBadge: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  section: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  technicianSection: {
    borderLeftWidth: 4,
    borderLeftColor: "#009688",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  amountText: {
    color: "#2196F3",
    marginLeft: 5,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 17,
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 10,
    paddingVertical: 8,
  },
  viewDetailsText: {
    color: "#fd7e14",
    fontWeight: "600",
    marginRight: 5,
  },
});

export default OrderDetailScreen;
