import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export const GameTitle = () => {
  return (
    <View style={styles.container}>
      {/* Display the newly adopted logo image */}
      <Image
        source={require('../../assets/icon.png')} // Adjust path if your components folder is structured differently
        style={styles.logoImage}
        resizeMode="contain"
      />



      {/* English subtitle with decorative lines */}
      <View style={styles.subtitleContainer}>
        <View style={styles.line} />
        <Text style={styles.subtitleText}>LAMMEH</Text>
        <View style={styles.line} />
      </View>

      {/* Description */}
      <Text style={styles.description}>
        اكتشف الضائع بين أصدقائك من خلال التلميحات
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  // New styles for the logo image
  logoImage: {
    width: 130,
    height: 130,
    borderRadius: 32,
    marginBottom: 10,
    elevation: 8, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  mainTitle: {
    fontSize: 64,
    fontWeight: '900',
    color: '#f6eefb',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 16,
    paddingBottom: 15,
    lineHeight: 80,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  line: {
    height: 1,
    width: 32,
    backgroundColor: '#4a3363',
  },
  subtitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4ecca3',
    letterSpacing: 4,
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    color: '#b9a6cc',
    textAlign: 'center',
    maxWidth: '90%',
    lineHeight: 22,
  },
});