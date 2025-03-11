import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  KeyboardAvoidingView, ScrollView, Platform, Image, Alert, Animated 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Additional form fields
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [aadhaarImage, setAadhaarImage] = useState(null); // State for Aadhaar image
  const [userPhoto, setUserPhoto] = useState(null); // State for user photo

  const [showPopup, setShowPopup] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0)); // Fade animation
  const [slideAnim] = useState(new Animated.Value(300)); // Slide animation from bottom

  const navigation = useNavigation();

  // Validation Function for initial form
  const validateInitial = () => {
    if (!name || !mobile || !address || !password || !confirmPassword) {
      Alert.alert("Error", "All fields except email are required.");
      return false;
    }
    if (mobile.length !== 10 || isNaN(mobile)) {
      Alert.alert("Error", "Mobile number must be 10 digits.");
      return false;
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert("Error", "Enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return false;
    }
    return true;
  };

  // Validation Function for additional form
  const validateAdditional = () => {
    if (!gender || !age || !ifscCode || !aadhaarImage || !userPhoto) {
      Alert.alert("Error", "All additional fields, including Aadhaar image and user photo, are required.");
      return false;
    }
    if (isNaN(age) || age < 1 || age > 120) {
      Alert.alert("Error", "Enter a valid age between 1 and 120.");
      return false;
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      Alert.alert("Error", "Enter a valid IFSC code (e.g., SBIN0001234).");
      return false;
    }
    return true;
  };

  // Show popup with animation
  const showPopupWithAnimation = () => {
    if (validateInitial()) {
      setShowPopup(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  // Hide popup with animation
  const hidePopupWithAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setShowPopup(false));
  };

  // Handle Aadhaar image upload
  const handleAadhaarImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Sorry, we need gallery permissions to upload your Aadhaar image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAadhaarImage(result.assets[0]);
    }
  };

  // Handle user photo upload
  const handleUserPhotoUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Sorry, we need gallery permissions to upload your photo.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect for profile photo
      quality: 1,
    });

    if (!result.canceled) {
      setUserPhoto(result.assets[0]);
    }
  };

  // Handle final signup with additional details and images
  const handleFinalSignup = async () => {
    if (!validateAdditional()) return;

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("mobile", mobile);
      formData.append("address", address);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("gender", gender);
      formData.append("age", age);
      formData.append("ifscCode", ifscCode);
      if (aadhaarImage) {
        formData.append("aadhaarImage", {
          uri: aadhaarImage.uri,
          type: aadhaarImage.type || "image/jpeg",
          name: aadhaarImage.fileName || "aadhaar.jpg",
        });
      }
      if (userPhoto) {
        formData.append("userPhoto", {
          uri: userPhoto.uri,
          type: userPhoto.type || "image/jpeg",
          name: userPhoto.fileName || "photo.jpg",
        });
      }

      const response = await fetch("https://your-api-endpoint.com/signup", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Account created successfully!", [
          { 
            text: "OK", 
            onPress: () => {
              hidePopupWithAnimation(); // Close popup
              navigation.navigate("LoginScreen"); // Move to next screen
            }
          },
        ]);
      } else {
        Alert.alert("Error", data.message || "Something went wrong.");
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please check your connection.");
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.innerContainer}
      >
        <Image source={require("../assets/images/user2.png")} style={styles.profileImage} />
        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          keyboardShouldPersistTaps="handled"
        >
          {/* Initial Form */}
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subtitle}>Create an account to get started!</Text>

          <Text style={styles.label}>Name</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter your name" 
            placeholderTextColor="#999"
            value={name} 
            onChangeText={setName} 
          />

          <Text style={styles.label}>Mobile Number</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter your mobile number" 
            keyboardType="phone-pad" 
            maxLength={10} 
            placeholderTextColor="#999"
            value={mobile} 
            onChangeText={setMobile} 
          />

          <Text style={styles.label}>Address</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter your address" 
            placeholderTextColor="#999"
            value={address} 
            onChangeText={setAddress} 
          />

          <Text style={styles.label}>Email (Optional)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter your email" 
            keyboardType="email-address" 
            placeholderTextColor="#999"
            value={email} 
            onChangeText={setEmail} 
          />

          <Text style={styles.label}>Password</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter your password" 
            secureTextEntry 
            placeholderTextColor="#999" 
            value={password} 
            onChangeText={setPassword} 
          />

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Confirm your password" 
            secureTextEntry 
            placeholderTextColor="#999" 
            value={confirmPassword} 
            onChangeText={setConfirmPassword} 
          />

          <TouchableOpacity style={styles.button} onPress={showPopupWithAnimation}>
            <Text style={styles.buttonText}>NEXT</Text>
          </TouchableOpacity>

          <Text style={styles.signupText}>
            Already have an account? <Text style={styles.signupLink} onPress={() => navigation.navigate("LoginScreen")}>Sign In</Text>
          </Text>
          <Text style={styles.signupText}>
            Header screen? <Text style={styles.signupLink} onPress={() => navigation.navigate("HeaderScreen")}>Click</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Image */}
      <Image source={require("../assets/images/img3.jpeg")} style={styles.bottomImage} />

      {/* Popup Form with ScrollView */}
      {showPopup && (
        <Animated.View 
          style={[
            styles.popupContainer, 
            { 
              opacity: fadeAnim, 
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <View style={styles.popup}>
            <ScrollView 
              contentContainerStyle={styles.popupScrollContainer} 
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.title}>Additional Details</Text>
              <Text style={styles.subtitle}>Please provide these details</Text>

              <Text style={styles.label}>Gender</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter your gender" 
                placeholderTextColor="#999"
                value={gender} 
                onChangeText={setGender} 
              />

              <Text style={styles.label}>Age</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter your age" 
                keyboardType="numeric" 
                placeholderTextColor="#999"
                value={age} 
                onChangeText={setAge} 
              />

              <Text style={styles.label}>IFSC Code</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter your bank IFSC code" 
                placeholderTextColor="#999"
                value={ifscCode} 
                onChangeText={setIfscCode} 
              />

              {/* Aadhaar Image Upload */}
              <Text style={styles.label}>Aadhaar Card Image</Text>
              {!aadhaarImage ? (
                <TouchableOpacity style={styles.imageBox} onPress={handleAadhaarImageUpload}>
                  <Text style={styles.plusSign}>+</Text>
                </TouchableOpacity>
              ) : (
                <Image 
                  source={{ uri: aadhaarImage.uri }} 
                  style={styles.uploadedImage} 
                />
              )}

              {/* User Photo Upload */}
              <Text style={styles.label}>Your Photo</Text>
              {!userPhoto ? (
                <TouchableOpacity style={styles.imageBox} onPress={handleUserPhotoUpload}>
                  <Text style={styles.plusSign}>+</Text>
                </TouchableOpacity>
              ) : (
                <Image 
                  source={{ uri: userPhoto.uri }} 
                  style={styles.uploadedImage} 
                />
              )}

              {/* Signup Button in Popup */}
              <TouchableOpacity style={styles.button} onPress={handleFinalSignup}>
                <Text style={styles.buttonText}>SIGN UP</Text>
              </TouchableOpacity>

              <Text style={styles.signupText}>
                <Text style={styles.signupLink} onPress={hidePopupWithAnimation}>Close</Text>
              </Text>
               {/* Already have an account */}
          <Text style={styles.signupText}>
            Already have an account? <Text style={styles.signupLink} onPress={() => navigation.navigate("LoginScreen")}>Sign In</Text>
          </Text>
          
         


            </ScrollView>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  innerContainer: { flex: 1, paddingHorizontal: 20 },
  scrollContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center", paddingBottom: 100 },
  title: { fontSize: 32, fontWeight: "bold", color: "#000", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 10 },
  label: { alignSelf: "flex-start", fontSize: 14, fontWeight: "bold", color: "#444", marginBottom: 5 },
  input: { width: "100%", backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 5, borderWidth: 1, borderColor: "#ddd" },
  button: { width: "100%", backgroundColor: "#ff9b42", padding: 15, borderRadius: 25, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  signupText: { marginTop: 15, color: "#666", textAlign: "center" },
  signupLink: { color: "#fd7e14", fontWeight: "bold" },
  bottomImage: { 
    position: "absolute", 
    bottom: 0, 
    width: "100%", 
    height: 100, 
    resizeMode: "cover", 
    zIndex: 0 
  },
  profileImage: { width: 150, height: 150, borderRadius: 40, alignSelf: "center", marginTop: 30 },
  popupContainer: { 
    position: "absolute", 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: "rgba(0,0,0,0.5)", 
    justifyContent: "flex-end",
    zIndex: 10 
  },
  popup: { 
    backgroundColor: "#fff", 
    paddingHorizontal: 20, 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    alignItems: "center", 
    minHeight: "50%", 
    maxHeight: "70%", 
  },
  popupScrollContainer: { 
    paddingVertical: 20, 
    alignItems: "center", 
    flexGrow: 1 
  },
  imageBox: { 
    width: 100, 
    height: 100, 
    backgroundColor: "#ddd", 
    borderRadius: 10, 
    justifyContent: "center", 
    alignItems: "center", 
    marginBottom: 10 
  },
  plusSign: { 
    fontSize: 40, 
    color: "#444", 
    fontWeight: "bold" 
  },
  uploadedImage: { 
    width: 150, 
    height: 100, 
    borderRadius: 10, 
    marginBottom: 10 
  },
});