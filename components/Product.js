import React from "react";
import { View, Text, FlatList, Image, StyleSheet, Dimensions } from "react-native";

const products = [
  { name: "Mobile phone / Tablet", image: require("../assets/images/phone.png") },
  { name: "Laptop / PC", image: require("../assets/images/lap.png") },
  { name: "A.C", image: require("../assets/images/AC.jpeg") },
  { name: "T.V", image: require("../assets/images/tv.png") },
  { name: "Fridge", image: require("../assets/images/fridg.png") },
  { name: "Microwave / Oven", image: require("../assets/images/microwave.png") },
  { name: "Geyser", image: require("../assets/images/geyser.png") },
  { name: "Heater", image: require("../assets/images/heater.png") },
  { name: "Washing machine", image: require("../assets/images/washing.png") },
  { name: "R.O", image: require("../assets/images/RO.png") },
  { name: "Induction", image: require("../assets/images/phone.png") },
];

// Get screen width for responsive grid layout
const numColumns = 2;
const cardWidth = Dimensions.get("window").width / numColumns - 20;

const Products = () => {
  return (
    <FlatList
      data={products}
      keyExtractor={(item, index) => index.toString()}
      numColumns={numColumns}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={item.image} style={styles.image} />
          <Text style={styles.productText}>{item.name}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 1,
    backgroundColor: "#f8f8f8",
  },
  card: {
    width: cardWidth,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginBottom: 10,
  },
  productText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
});

export default Products;
