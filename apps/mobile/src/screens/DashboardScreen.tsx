import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '../styles/theme';

export const DashboardScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header & Battery Flag */}
      <View style={styles.header}>
        <Text style={styles.title}>Lumina</Text>
        <TouchableOpacity style={styles.batteryBadge}>
          <Text style={styles.batteryText}>Battery Saver <Text style={{color: theme.colors.success}}>OFF</Text></Text>
        </TouchableOpacity>
      </View>

      {/* Focus Session Hero */}
      <View style={[styles.glassCard, styles.heroCard]}>
        <Text style={styles.subtitle}>TODAY'S FOCUS</Text>
        <Text style={styles.heroMetric}>10:00<Text style={styles.metricMuted}> - 12:00 PM</Text></Text>
        <Text style={styles.detailText}>Object Oriented Programming</Text>
        
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Start Study Session</Text>
        </TouchableOpacity>
      </View>

      {/* Cognitive Score & Analytics */}
      <View style={styles.row}>
        <View style={[styles.glassCard, styles.flexCard]}>
          <Text style={styles.subtitle}>COGNITIVE SCORE</Text>
          <Text style={[styles.heroMetric, { color: theme.colors.accentPrimary }]}>92%</Text>
          <Text style={styles.detailText}>Peak Focus</Text>
        </View>

        {/* Expense Quick Action */}
        <View style={[styles.glassCard, styles.flexCard]}>
          <Text style={styles.subtitle}>EXPENSES</Text>
          <Text style={styles.heroMetric}>$14<Text style={styles.metricMuted}>.20</Text></Text>
          
          <TouchableOpacity style={[styles.primaryButton, styles.secondaryButton]}>
            <Text style={styles.secondaryButtonText}>+ Add Expense</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
  },
  batteryBadge: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  batteryText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  glassCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.glassmorphism.borderRadius,
    borderWidth: theme.glassmorphism.borderWidth,
    borderColor: theme.colors.border,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.m,
  },
  heroCard: {
    paddingVertical: theme.spacing.xl,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.m,
  },
  flexCard: {
    flex: 1,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: theme.spacing.s,
  },
  heroMetric: {
    color: theme.colors.textPrimary,
    fontSize: 32,
    fontWeight: '700',
  },
  metricMuted: {
    color: theme.colors.textMuted,
    fontSize: 18,
  },
  detailText: {
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.l,
  },
  primaryButton: {
    backgroundColor: theme.colors.accentSecondary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: theme.colors.surfaceHighlight,
    marginTop: 'auto',
  },
  secondaryButtonText: {
    color: theme.colors.accentPrimary,
    fontWeight: '600',
  }
});
