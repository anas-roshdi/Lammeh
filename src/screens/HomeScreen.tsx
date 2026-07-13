import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar
} from 'react-native';
import { Play, HelpCircle, Settings, Users } from 'lucide-react-native';
import { GameTitle } from '../components/GameTitle';
import SettingsModal from '../components/SettingsModal';

export default function HomeScreen({ navigation }: any) {
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#2a1b38" />

        {/* Top Bar Navigation */}
        <View style={styles.header}>
          {/* Players Count Badge */}
          <View style={styles.playersBadge}>
            <Users size={16} color="#4ecca3" />
            <Text style={styles.playersText}>٣-١٢ لاعب</Text>
          </View>

          {/* Settings Button */}
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setIsSettingsVisible(true)}
          >
            <Settings size={20} color="#b9a6cc" />
          </TouchableOpacity>
        </View>

        {/* Main Content Area */}
        <View style={styles.content}>
          <GameTitle />

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('CategorySelection')}
              activeOpacity={0.8}
            >
              <Play size={24} fill="#2a1b38" color="#2a1b38" />
              <Text style={styles.primaryButtonText}>ابدأ اللعب</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('HowToPlay')}
              style={styles.secondaryButton}
              activeOpacity={0.7}
            >
              <HelpCircle size={20} color="#4ecca3" />
              <Text style={styles.secondaryButtonText}>كيف تلعب</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Version Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>الإصدار ١.٠ — العب مع أصدقائك</Text>
          <Text style={styles.footerText}>Created by Anoosyhero</Text>
        </View>
        <SettingsModal
          visible={isSettingsVisible}
          onClose={() => setIsSettingsVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#2a1b38',
  },
  // Centers the app content and limits its maximum width
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 650,
    alignSelf: 'center',
    backgroundColor: '#2a1b38',
    // Keep your other existing styles below (padding, alignment, etc.)
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    zIndex: 10,
  },
  playersBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(58, 38, 80, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4a3363',
  },
  playersText: {
    color: '#b9a6cc',
    fontSize: 12,
    fontWeight: 'bold',
  },
  settingsButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(58, 38, 80, 0.6)',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4a3363',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 48,
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 16,
    marginTop: 20,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff7315', // Vibrant Orange
    paddingVertical: 20,
    borderRadius: 16,
    gap: 12,
    elevation: 8,
    shadowColor: '#ff7315',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  primaryButtonText: {
    color: '#2a1b38',
    fontSize: 24,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(78, 204, 163, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(78, 204, 163, 0.6)',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
  },
  secondaryButtonText: {
    color: '#4ecca3', // Mint Green
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    color: '#b9a6cc',
    fontSize: 12,
    fontWeight: '500',
    paddingBottom: 5
  },
});