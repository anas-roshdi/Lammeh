import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const GameTitle = () => {
  return (
    <View style={styles.container}>
      {/* Detective / hint mascot mark */}
      <View style={styles.mascotBox}>
        <View style={styles.questionBadge}>
          <Text style={styles.questionText}>؟</Text>
        </View>

        {/* Two peeking eyes */}
        <View style={styles.eyesContainer}>
          <View style={styles.eyeBg}>
            <View style={styles.eyePupil} />
          </View>
          <View style={styles.eyeBg}>
            <View style={styles.eyePupil} />
          </View>
        </View>
      </View>

      {/* Main Arabic Title */}
      <Text style={styles.mainTitle}>لمّح</Text>

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
  mascotBox: {
    width: 80,
    height: 80,
    backgroundColor: '#ff7315',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 50, // Adds shadow for Android
    shadowColor: '#ff7315', // Shadow for iOS
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  questionBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    backgroundColor: '#4ecca3',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '12deg' }],
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  questionText: {
    color: '#10352a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  eyesContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  eyeBg: {
    width: 24,
    height: 24,
    backgroundColor: '#2a1b38',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyePupil: {
    width: 10,
    height: 10,
    backgroundColor: '#ff7315',
    borderRadius: 5,
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