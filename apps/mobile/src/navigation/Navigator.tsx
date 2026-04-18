import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { DashboardScreen } from '../screens/DashboardScreen';
import { TimetableScreen } from '../screens/TimetableScreen';
import { SquadHubScreen } from '../screens/SquadHubScreen';
import { SecondBrainScreen } from '../screens/SecondBrainScreen';
import { GlobalModalStack } from './GlobalModalStack';
import { theme } from '../styles/theme';

export const Navigator = () => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'SCHEDULE' | 'SQUADS' | 'BRAIN'>('DASHBOARD');
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      
      {/* 4 Pillars Routing explicitly */}
      <View style={styles.screenContainer}>
        {activeTab === 'DASHBOARD' && <DashboardScreen />}
        {activeTab === 'SCHEDULE' && <TimetableScreen />}
        {activeTab === 'BRAIN' && <SecondBrainScreen />}
        {activeTab === 'SQUADS' && <SquadHubScreen />}
      </View>

      {/* Hidden 5th Global Stack */}
      <GlobalModalStack isVisible={modalVisible} modalType="pdf" closeModal={() => setModalVisible(false)} />

      {/* React Navigation Native Bottom Tabs strictly mapped */}
      <View style={styles.bottomTab}>
        {['DASHBOARD', 'SCHEDULE', 'BRAIN', 'SQUADS'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.substring(0,4)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  screenContainer: { flex: 1 },
  bottomTab: {
    flexDirection: 'row',
    height: 85,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 16,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(185, 43, 255, 0.1)', // Subtle Glassmorphism Violet Highlight
  },
  tabText: { color: theme.colors.textMuted, fontSize: 12, fontWeight: '700' },
  tabTextActive: { color: theme.colors.accentSecondary }
});
