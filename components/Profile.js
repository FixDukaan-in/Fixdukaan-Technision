import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialIcons, FontAwesome, Feather } from "@expo/vector-icons";

const TechnicianProfileScreen = () => {
  // Remove route dependency and hardcode userType or manage it differently
  const [isAdmin] = useState(false); // Set to true if admin view is needed

  const [technician, setTechnician] = useState({
    id: "tech123",
    name: "Rajesh Kumar",
    age: 32,
    gender: "Male",
    email: "rajesh.kumar@example.com",
    mobile: "+91 9876543210",
    accountNumber: "123456789012",
    bankName: "State Bank of India",
    ifscCode: "SBIN0001234",
    aadhaarNumber: "1234 5678 9012",
    profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    aadhaarVerified: false,
    bankVerified: false,
    identityVerified: false,
    overallStatus: "Pending Verification",
  });

  const handleVerifyDocuments = () => {
    Alert.alert(
      "Verify Documents",
      "Are you sure all documents are valid and you want to verify this technician?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Verify",
          onPress: () => {
            setTechnician({
              ...technician,
              aadhaarVerified: true,
              bankVerified: true,
              identityVerified: true,
              overallStatus: "Verified",
            });
            Alert.alert(
              "Success",
              "Technician has been verified and appointed!"
            );
          },
        },
      ]
    );
  };

  const renderVerificationBadge = (verified) => {
    return (
      <View
        style={[
          styles.verificationBadge,
          { backgroundColor: verified ? "#4CAF50" : "#F44336" },
        ]}
      >
        <Text style={styles.verificationText}>
          {verified ? "Verified" : "Not Verified"}
        </Text>
        {verified ? (
          <MaterialIcons name="verified" size={16} color="white" />
        ) : (
          <Feather name="alert-circle" size={16} color="white" />
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={{ uri: technician.profileImage }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{technician.name}</Text>
        <Text style={styles.status}>
          Status:
          <Text
            style={[
              styles.statusText,
              technician.overallStatus === "Verified" && { color: "#4CAF50" },
              technician.overallStatus === "Pending Verification" && {
                color: "#FF9800",
              },
              technician.overallStatus === "Rejected" && { color: "#F44336" },
            ]}
          >
            {` ${technician.overallStatus}`}
          </Text>
        </Text>
      </View>

      {/* Personal Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Age:</Text>
          <Text style={styles.infoValue}>{technician.age} years</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Gender:</Text>
          <Text style={styles.infoValue}>{technician.gender}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{technician.email}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Mobile:</Text>
          <Text style={styles.infoValue}>{technician.mobile}</Text>
        </View>
      </View>

      {/* Bank Account Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bank Account Details</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Account Number:</Text>
          <Text style={styles.infoValue}>{technician.accountNumber}</Text>
          {renderVerificationBadge(technician.bankVerified)}
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Bank Name:</Text>
          <Text style={styles.infoValue}>{technician.bankName}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>IFSC Code:</Text>
          <Text style={styles.infoValue}>{technician.ifscCode}</Text>
        </View>
      </View>

      {/* Identity Verification Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Identity Verification</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Aadhaar Number:</Text>
          <Text style={styles.infoValue}>{technician.aadhaarNumber}</Text>
          {renderVerificationBadge(technician.aadhaarVerified)}
        </View>

        <View style={styles.documentPreview}>
          <FontAwesome name="id-card" size={24} color="#555" />
          <Text style={styles.documentText}>Aadhaar Front</Text>
        </View>
        <View style={styles.documentPreview}>
          <FontAwesome name="id-card" size={24} color="#555" />
          <Text style={styles.documentText}>Aadhaar Back</Text>
        </View>
      </View>

      {/* Only show verify button if isAdmin is true */}
      {isAdmin && technician.overallStatus !== "Verified" && (
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerifyDocuments}
        >
          <Text style={styles.verifyButtonText}>
            Verify & Appoint Technician
          </Text>
        </TouchableOpacity>
      )}

      {technician.overallStatus === "Verified" && (
        <View style={styles.successBox}>
          <MaterialIcons name="verified" size={24} color="#4CAF50" />
          <Text style={styles.successText}>
            {isAdmin
              ? "Technician is verified and appointed"
              : "Your profile has been verified"}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  status: {
    fontSize: 16,
    color: "#666",
  },
  statusText: {
    fontWeight: "bold",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    flex: 1,
    textAlign: "right",
    marginRight: 8,
  },
  verificationBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verificationText: {
    color: "white",
    fontSize: 12,
    marginRight: 4,
  },
  documentPreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  documentText: {
    marginLeft: 12,
    color: "#555",
  },
  verifyButton: {
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  verifyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  successBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 10,
    marginBottom: 24,
  },
  successText: {
    color: "#4CAF50",
    marginLeft: 12,
    fontWeight: "500",
  },
});
// ... (keep your existing styles)

export default TechnicianProfileScreen;
