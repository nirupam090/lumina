import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DashboardScreen } from '../screens/DashboardScreen';
import { TimetableScreen } from '../screens/TimetableScreen';
import { SquadHubScreen } from '../screens/SquadHubScreen';
import { SecondBrainScreen } from '../screens/SecondBrainScreen';
import { theme } from '../styles/theme';

type TabKey = 'home' | 'schedule' | 'brain' | 'squad';

interface TabConfig {
  key: TabKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
  color: string;
}

const TABS: TabConfig[] = [
  { key: 'home', label: 'Home', icon: 'grid-outline', iconActive: 'grid', color: theme.colors.accentBlue },
  { key: 'schedule', label: 'Schedule', icon: 'calendar-outline', iconActive: 'calendar', color: theme.colors.accentViolet },
  { key: 'brain', label: 'Brain', icon: 'search-outline', iconActive: 'search', color: theme.colors.accentCyan },
  { key: 'squad', label: 'Squad', icon: 'people-outline', iconActive: 'people', color: theme.colors.accentPink },
];

export const Navigator = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <DashboardScreen />;
      case 'schedule': return <TimetableScreen />;
      case 'brain': return <SecondBrainScreen />;
      case 'squad': return <SquadHubScreen />;
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.screenContainer}>{renderScreen()}</View>

      {/* Bottom Navigation */}
      <View style={styles.navBar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.navItem}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <View style={[styles.navIconWrap, isActive && { backgroundColor: `${tab.color}15` }]}>
                <Ionicons
                  name={isActive ? tab.iconActive : tab.icon}
                  size={22}
                  color={isActive ? tab.color : theme.colors.textMuted}
                />
              </View>
              <Text style={[styles.navLabel, isActive && { color: tab.color }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  screenContainer: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.backgroundElevated,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    paddingHorizontal: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navIconWrap: {
    width: 44,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navLabel: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
});
