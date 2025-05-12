import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";

const screenWidth = Dimensions.get("window").width;

const GrowthScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("daily");
  const [chartData, setChartData] = useState(null);
  const [topTechnicians, setTopTechnicians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBar, setSelectedBar] = useState(null);

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 0.8) => `rgba(253, 126, 20, ${opacity})`, // Set opacity to 0.8
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: selectedPeriod === "monthly" ? 0.5 : 0.7,
    decimalPlaces: 0,
    formatYLabel: (value) => Math.floor(value).toString(),
    propsForLabels: {
      fontSize: 10,
    },
    propsForVerticalLabels: {
      fontSize: selectedPeriod === "monthly" ? 7 : 10,
    },
    fillShadowGradient: "#FD7E14",
    fillShadowGradientOpacity: 0.8, // Reduced opacity for shadow
    barRadius: 4, // Rounded corners for bars
    propsForBackgroundLines: {
      strokeWidth: 0.5,
      strokeDasharray: "", // solid line
    },
    useShadowColorFromDataset: false, // Important: Use our color instead of dataset color
  };

  useEffect(() => {
    fetchChartData();
    fetchTopTechnicians();
  }, [selectedPeriod]);

  const fetchChartData = async () => {
    setLoading(true);
    setSelectedBar(null);
    try {
      let response;
      if (selectedPeriod === "daily") {
        response = await fakeFetchDaily();
      } else if (selectedPeriod === "weekly") {
        response = await fakeFetchWeekly();
      } else {
        response = await fakeFetchMonthly();
      }
      setChartData(response);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
    setLoading(false);
  };

  const fetchTopTechnicians = async () => {
    try {
      const response = await fakeFetchTechnicians();
      setTopTechnicians(response);
    } catch (error) {
      console.error("Error fetching technicians:", error);
    }
  };

  const fakeFetchDaily = async () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const data = Array.from({ length: 7 }, () =>
      Math.floor(Math.random() * 100)
    );
    return {
      labels: days,
      datasets: [{ data }],
      data,
    };
  };

  const fakeFetchWeekly = async () => {
    const weeks = Array.from({ length: 4 }, (_, i) => `Week ${i + 1}`);
    const data = Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 500)
    );
    return {
      labels: weeks,
      datasets: [{ data }],
      data,
    };
  };

  const fakeFetchMonthly = async () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const data = Array.from({ length: 12 }, () =>
      Math.floor(Math.random() * 2000)
    );
    return {
      labels: months,
      datasets: [{ data }],
      data,
    };
  };

  const fakeFetchTechnicians = async () => {
    return [
      { id: "1", name: "John Doe", completedOrders: 45 },
      { id: "2", name: "Jane Smith", completedOrders: 38 },
      { id: "3", name: "Mike Johnson", completedOrders: 32 },
      { id: "4", name: "Sarah Williams", completedOrders: 29 },
      { id: "5", name: "Tom Brown", completedOrders: 25 },
    ].sort((a, b) => b.completedOrders - a.completedOrders);
  };

  const handleChartPress = (event) => {
    if (!chartData || !chartData.labels || !chartData.datasets) return;

    const { locationX } = event.nativeEvent;
    const chartWidth = screenWidth - 40; // Chart width
    const barCount = chartData.labels.length;
    const barWidth = chartWidth / barCount;

    // Adjust for chart padding (approximate, may need tuning)
    const paddingOffset = selectedPeriod === "monthly" ? 10 : 0; // Add padding for monthly
    const adjustedLocationX = locationX - paddingOffset;

    // Calculate which bar was clicked
    const barIndex = Math.floor(adjustedLocationX / barWidth);

    if (barIndex >= 0 && barIndex < barCount) {
      const value = chartData.datasets[0].data[barIndex];
      const label = chartData.labels[barIndex];
      const leftPosition =
        barIndex * barWidth + barWidth / 2 - 50 + paddingOffset; // Center tooltip

      setSelectedBar({
        index: barIndex,
        value,
        label,
        left: leftPosition,
      });
    } else {
      setSelectedBar(null); // Dismiss tooltip if tap is outside bars
    }
  };

  const renderChart = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#FD7E14" />;
    }

    if (!chartData) return null;

    const chartWidth =
      selectedPeriod === "monthly" ? screenWidth * 1.5 : screenWidth - 40; // Wider chart for monthly

    return (
      <View style={styles.chartWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: selectedPeriod === "monthly" ? 10 : 0,
          }}
        >
          <TouchableWithoutFeedback onPress={handleChartPress}>
            <View>
              <BarChart
                data={{
                  labels: chartData.labels,
                  datasets: [
                    {
                      data: chartData.data,
                      colors: chartData.data.map(
                        () => (opacity) => `rgba(253, 126, 20, ${opacity})`
                      ),
                    },
                  ],
                }}
                width={chartWidth}
                height={300}
                chartConfig={chartConfig}
                style={styles.chart}
                verticalLabelRotation={selectedPeriod === "monthly" ? 30 : 0}
                fromZero
                showBarTops={false}
                flatColor={true} // Use flat color instead of gradient
                withHorizontalLabels={true}
                withVerticalLabels={true}
              />
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>

        {selectedBar && (
          <View style={[styles.tooltip, { left: selectedBar.left }]}>
            <Text style={styles.tooltipText}>
              {selectedBar.label}: {selectedBar.value} orders
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderTechnicianItem = ({ item }) => (
    <View style={styles.technicianItem}>
      <Text style={styles.technicianName}>{item.name}</Text>
      <Text style={styles.orderCount}>{item.completedOrders} orders</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Select Time Period</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedPeriod}
          onValueChange={(itemValue) => setSelectedPeriod(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Daily (Last 7 days)" value="daily" />
          <Picker.Item label="Weekly (Last 4 weeks)" value="weekly" />
          <Picker.Item label="Monthly (Last 12 months)" value="monthly" />
        </Picker>
      </View>

      <Text style={styles.title}>
        {selectedPeriod === "daily"
          ? "Daily Orders (Last 7 days)"
          : selectedPeriod === "weekly"
          ? "Weekly Orders (Last 4 weeks)"
          : "Monthly Orders (Last 12 months)"}
      </Text>

      <View style={styles.chartContainer}>
        {renderChart()}
        <Text style={styles.noteText}>Tap on any bar to see order details</Text>
      </View>

      <Text style={styles.title}>Top Technicians</Text>
      <View style={styles.techniciansContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#FD7E14" />
        ) : (
          <FlatList
            data={topTechnicians}
            renderItem={renderTechnicianItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
    color: "#565656",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: 50,
    color: "#fd7e14",
  },
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 5,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartWrapper: {
    position: "relative",
    marginBottom: 10,
  },
  chart: {
    borderRadius: 16,
    color: "#fd7e14",
  },
  tooltip: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 10,
    borderRadius: 5,
    top: 10,
    width: 100,
  },
  tooltipText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  noteText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
  techniciansContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    minHeight: 200,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  technicianItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  technicianName: {
    fontSize: 16,
    color: "#565656",
  },
  orderCount: {
    fontSize: 16,
    color: "#FD7E14",
    fontWeight: "bold",
  },
});

export default GrowthScreen;
