import React, { useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";

// List of products with names and corresponding images
const products = [
  { id: 1, name: "Mobile phone / Tablet", image: require("../assets/images/phone.png") },
  { id: 2, name: "Laptop / PC", image: require("../assets/images/lap.png") },
  { id: 3, name: "A.C", image: require("../assets/images/AC.jpeg") },
  { id: 4, name: "T.V", image: require("../assets/images/tv.png") },
  { id: 5, name: "Fridge", image: require("../assets/images/fridg.png") },
  { id: 6, name: "Microwave / Oven", image: require("../assets/images/microwave.png") },
  { id: 7, name: "Geyser", image: require("../assets/images/geyser.png") },
  { id: 8, name: "Heater", image: require("../assets/images/heater.png") },
  { id: 9, name: "Washing machine", image: require("../assets/images/washing.png") },
  { id: 10, name: "R.O", image: require("../assets/images/RO.png") },
  { id: 11, name: "Induction", image: require("../assets/images/induction.png") },
];

const numColumns = 2; // Number of columns in grid layout
const cardWidth = Dimensions.get("window").width / numColumns - 20; // Calculate width for grid items

const Products = () => {
  const [selectedProducts, setSelectedProducts] = useState([]); // Store selected products
  const [showProducts, setShowProducts] = useState(false); // Track whether to show product list
  const [saved, setSaved] = useState(false); // Track if selections are saved

  // Toggle selection for a product (add/remove from selected list)
  const toggleSelection = (item) => {
    setSelectedProducts((prevSelected) => {
      if (prevSelected.find((p) => p.id === item.id)) {
        return prevSelected.filter((p) => p.id !== item.id); // Remove if already selected
      } else {
        return [...prevSelected, item]; // Add to selection
      }
    });
  };

  // Save selected products and prevent further selection
  const handleSave = () => {
    setSaved(true);
  };

  // Reset selection state to allow adding more products
  const handleAddMore = () => {
    setSaved(false);
  };

  // Show "Add Products" button initially , before the user clicks on Add Products, the empty page will show this button only
  if (!showProducts) {
    return (
      <View style={styles.fullScreenContainer}>
        <TouchableOpacity style={styles.addProductButton} onPress={() => setShowProducts(true)}>
          <Text style={styles.addProductText}>Add Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Upper half: Display selected products */}
      <View style={styles.selectedContainer}>
        <FlatList
          data={selectedProducts}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          renderItem={({ item }) => (
            <View style={styles.selectedCard}>
              <Image source={item.image} style={styles.image} /> {/* Selected items are displayed normally */}
              <Text style={styles.productText}>{item.name}</Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>No products selected yet</Text>
          )}
        />
      </View>

      {/* Bottom half: Product selection grid */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => {
          const isSelected = selectedProducts.some((p) => p.id === item.id);
          const shouldBeGray = saved ? true : isSelected; // Grayscale effect when saved
          return (
            <TouchableOpacity onPress={() => toggleSelection(item)}>
              <View style={styles.card}>
                <Image
                  source={item.image}
                  style={[styles.image, shouldBeGray && { tintColor: "gray" }]}
                />
                <Text style={styles.productText}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Buttons: Save & Add More */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleAddMore}>
          <Text style={styles.buttonText}>Add More Products</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  addProductButton: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    backgroundColor: "#fd7e14",
    borderRadius: 10,
  },
  addProductText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  selectedContainer: {
    height: "20%",
    backgroundColor: "#fd7e14",
    paddingVertical: 10,
    alignItems: "center",
  },
  selectedCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: 20,
    backgroundColor: "#fff",
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  button: {
    backgroundColor: "#fd7e14",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    padding: 20,
  },
});

export default Products;