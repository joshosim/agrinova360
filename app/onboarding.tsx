import paths from "@/utils/paths";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Onboarding({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://i.ibb.co/2tQw7gN/farm-illustration.png" }}
        style={styles.image}
      />

      <Text style={styles.title}>Welcome to Agrinova360</Text>

      <Text style={styles.subtitle}>
        Your smart agriculture companion. Manage crops, track progress, and
        boost productivity with ease.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate(paths.home)}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 40,
    resizeMode: "contain",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2E7D32", // green theme
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#2E7D32",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
