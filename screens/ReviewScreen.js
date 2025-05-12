import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Card } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

const CustomerReviewScreen = ({ navigation }) => {
  const [productRating, setProductRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [appRating, setAppRating] = useState(0);
  const [productReview, setProductReview] = useState("");
  const [serviceReview, setServiceReview] = useState("");
  const [appReview, setAppReview] = useState("");

  const handleRating = (type, star) => {
    if (type === "product") setProductRating(star);
    else if (type === "service") setServiceRating(star);
    else if (type === "app") setAppRating(star);
  };

  const submitReview = () => {
    if (productRating === 0 || serviceRating === 0 || appRating === 0) {
      Alert.alert("Error", "Please provide a rating for all sections.");
      return;
    }

    const reviewData = {
      product: { rating: productRating, review: productReview },
      service: { rating: serviceRating, review: serviceReview },
      app: { rating: appRating, review: appReview },
    };

    // Log or send to backend (e.g., Firebase)
    console.log("Review Submitted:", reviewData);

    Alert.alert(
      "Thank You!",
      "Your feedback has been submitted successfully.",
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
  };

  const renderStarRating = (type, rating, setRating) => (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => handleRating(type, star)}>
          <FontAwesome
            name="star"
            size={30}
            color={star <= rating ? "#ffcc00" : "#ddd"}
            style={styles.star}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <LinearGradient
      colors={["#FFB75E", "#ED8F03"]}
      style={styles.gradientContainer}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Share Your Feedback</Text>

            {/* Product Review */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Product After Repair</Text>
              {renderStarRating("product", productRating, setProductRating)}
              <TextInput
                style={styles.input}
                placeholder="How is the product after repair?"
                multiline
                value={productReview}
                onChangeText={setProductReview}
                placeholderTextColor="#888"
              />
            </View>

            {/* Technician Service Review */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Technician Service</Text>
              {renderStarRating("service", serviceRating, setServiceRating)}
              <TextInput
                style={styles.input}
                placeholder="How was our technician's service?"
                multiline
                value={serviceReview}
                onChangeText={setServiceReview}
                placeholderTextColor="#888"
              />
            </View>

            {/* App Experience Review */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>App Experience</Text>
              {renderStarRating("app", appRating, setAppRating)}
              <TextInput
                style={styles.input}
                placeholder="How was your experience with the app?"
                multiline
                value={appReview}
                onChangeText={setAppReview}
                placeholderTextColor="#888"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.button} onPress={submitReview}>
              <Text style={styles.buttonText}>Submit Feedback</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  card: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 25,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
    marginBottom: 10,
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  star: {
    marginHorizontal: 5,
  },
  input: {
    height: 90,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: "top",
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  button: {
    backgroundColor: "#ff7f00",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default CustomerReviewScreen;
