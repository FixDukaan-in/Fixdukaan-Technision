import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// Mock data
const sampleImage1 = require("../assets/images/image.png");
const sampleImage2 = require("../assets/images/image.png");
const sampleaudio = require("../assets/video/sample-12s.mp3");
const sampleaudio2 = require("../assets/video/sample-15s.mp3");

const { width } = Dimensions.get("window");

const TaskDetailsScreen = ({ route }) => {
  const { task } = route.params;
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRecording, setCurrentRecording] = useState(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  const images = [sampleImage1, sampleImage2];
  const recordings = [
    { id: 1, uri: sampleaudio, name: "Diagnosis Notes", duration: "0:12" },
    { id: 2, uri: sampleaudio2, name: "Customer Request", duration: "0:15" },
  ];

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync().catch((error) => {
          console.error("Error unloading sound:", error);
        });
      }
    };
  }, [sound]);

  const handleAccept = () => {
    navigation.navigate("TaskDetailScreen", { task });
  };

  const handleDecline = () => {
    alert("Task Declined");
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const playAudio = async (recording) => {
    try {
      setIsLoading(true);

      // If we're clicking the same recording that's currently loaded
      if (sound && currentRecording?.id === recording.id) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          if (isPlaying) {
            await sound.pauseAsync();
            setIsPlaying(false);
          } else {
            await sound.playAsync();
            setIsPlaying(true);
          }
          setIsLoading(false);
          return;
        }
      }

      // Clean up existing sound if it exists
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }

      // Create and load new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        recording.uri,
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
      setCurrentRecording(recording);
      setIsPlaying(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsLoading(false);
      setIsPlaying(false);
      setCurrentRecording(null);
      if (sound) {
        sound
          .unloadAsync()
          .catch((err) => console.error("Error unloading failed sound:", err));
        setSound(null);
      }
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
      setSliderValue(status.positionMillis / (status.durationMillis || 1));

      if (status.didJustFinish) {
        setIsPlaying(false);
        setSliderValue(0);
        setCurrentRecording(null);
        if (sound) {
          sound.unloadAsync().catch((error) => {
            console.error("Error unloading finished sound:", error);
          });
          setSound(null);
        }
      }
    }
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const onSliderValueChange = async (value) => {
    if (sound && duration > 0) {
      try {
        const newPosition = value * duration;
        setSliderValue(value);
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          await sound.setPositionAsync(newPosition);
          setPosition(newPosition);
        }
      } catch (error) {
        console.error("Error seeking audio:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Repair Details</Text>
            <View style={[styles.statusBadge, { backgroundColor: "#fff4e6" }]}>
              <Text style={[styles.statusText, { color: "#fd7e14" }]}>New</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={20} color="#fd7e14" />
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Customer: </Text>
              {task.customer}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="phone-portrait-outline" size={20} color="#fd7e14" />
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Device: </Text>
              {task.device} ({task.brand})
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="alert-circle-outline" size={20} color="#fd7e14" />
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Issue: </Text>
              {task.issue}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={20} color="#fd7e14" />
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Address: </Text>
              {task.address}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color="#fd7e14" />
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Schedule: </Text>
              {task.date} | {task.timeSlot}
            </Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="images-outline" size={24} color="#fd7e14" />
            <Text style={styles.sectionTitle}>Uploaded Images</Text>
          </View>
          <FlatList
            data={images}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imageList}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => openImageModal(item)}
                style={styles.imageContainer}
              >
                <Image source={item} style={styles.image} />
                <View style={styles.imageOverlay}>
                  <Ionicons name="expand-outline" size={24} color="white" />
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="mic-outline" size={24} color="#fd7e14" />
            <Text style={styles.sectionTitle}>Voice Notes</Text>
          </View>
          {recordings.map((recording) => (
            <View key={recording.id} style={styles.audioCard}>
              <TouchableOpacity
                style={styles.audioButton}
                onPress={() => playAudio(recording)}
                disabled={isLoading}
              >
                <View style={styles.audioIconContainer}>
                  <MaterialIcons
                    name={
                      currentRecording?.id === recording.id && isPlaying
                        ? "pause"
                        : "play-arrow"
                    }
                    size={24}
                    color="#fd7e14"
                  />
                </View>
                <View style={styles.audioTextContainer}>
                  <Text style={styles.audioTitle}>{recording.name}</Text>
                  <Text style={styles.audioDuration}>
                    {currentRecording?.id === recording.id
                      ? formatTime(position)
                      : recording.duration}
                  </Text>
                </View>
              </TouchableOpacity>
              {currentRecording?.id === recording.id && (
                <Slider
                  style={styles.seekBar}
                  minimumValue={0}
                  maximumValue={1}
                  value={sliderValue}
                  onValueChange={onSliderValueChange}
                  minimumTrackTintColor="#fd7e14"
                  maximumTrackTintColor="#e9ecef"
                  thumbTintColor="#fd7e14"
                  disabled={isLoading}
                />
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.declineButton]}
          onPress={handleDecline}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          onPress={handleAccept}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        onRequestClose={closeImageModal}
      >
        <TouchableWithoutFeedback onPress={closeImageModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Image source={selectedImage} style={styles.fullImage} />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeImageModal}
              >
                <Ionicons name="close" size={30} color="white" />
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
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3f5",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontWeight: "600",
    fontSize: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  detailText: {
    fontSize: 15,
    marginLeft: 12,
    color: "#495057",
    lineHeight: 22,
  },
  bold: {
    fontWeight: "600",
    color: "#212529",
  },
  sectionContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#212529",
    marginLeft: 10,
  },
  imageList: {
    paddingLeft: 0,
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginRight: 12,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 8,
    alignItems: "flex-end",
  },
  audioCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    overflow: "hidden",
  },
  audioButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  audioIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff4e6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  audioTextContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  audioTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#212529",
  },
  audioDuration: {
    fontSize: 12,
    color: "#868e96",
    minWidth: 40,
    textAlign: "right",
  },
  seekBar: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#f1f3f5",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptButton: {
    backgroundColor: "#2b8a3e",
    marginLeft: 8,
  },
  declineButton: {
    backgroundColor: "#c92a2a",
    marginRight: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 5,
  },
});

export default TaskDetailsScreen;
