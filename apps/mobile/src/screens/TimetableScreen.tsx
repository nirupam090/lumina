import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';

export const TimetableScreen = () => {
  const [viewMode, setViewMode] = useState<'TODAY' | 'WEEK'>('TODAY');

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Schedule</Text>
      
      {/* Toggle View Mode */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={[styles.toggleButton, viewMode === 'TODAY' && styles.activeToggle]}
          onPress={() => setViewMode('TODAY')}>
          <Text style={[styles.toggleText, viewMode === 'TODAY' && styles.activeToggleText]}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.toggleButton, viewMode === 'WEEK' && styles.activeToggle]}
          onPress={() => setViewMode('WEEK')}>
          <Text style={[styles.toggleText, viewMode === 'WEEK' && styles.activeToggleText]}>Week View</Text>
        </TouchableOpacity>
      </View>

      {/* Next Class Urgency Indicator */}
      <View style={[styles.glassCard, styles.urgencyCard]}>
        <Text style={styles.subtitle}>STARTING IN</Text>
        <Text style={styles.countdownMetric}>1hr 24m</Text>
        <Text style={styles.subjectText}>Quantum Mechanics Lab</Text>
      </View>

      {/* Bunk Analytics Ring Matrix */}
      <View style={styles.glassCard}>
        <Text style={styles.subtitle}>BUNK ANALYTICS (75% RULE)</Text>
        <View style={styles.analyticsRow}>
          <View style={styles.ringPlaceholder}>
             <Text style={styles.ringValue}>2</Text>
          </View>
          <View style={styles.analyticsData}>
            <Text style={styles.strongText}>Safe Bunks Remaining</Text>
            <Text style={styles.mutedDesc}>You can functionally miss 2 more classes before dropping below 75% threshold natively.</Text>
          </View>
        </View>
      </View>

      {/* Floating Action PDF Upload */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabIcon}>📄</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.l, paddingTop: theme.spacing.xxl },
  pageTitle: { color: theme.colors.textPrimary, fontSize: 32, fontWeight: '800', marginBottom: theme.spacing.m },
  toggleContainer: { flexDirection: 'row', backgroundColor: theme.colors.surface, borderRadius: 12, padding: 4, marginBottom: theme.spacing.l },
  toggleButton: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 8 },
  activeToggle: { backgroundColor: theme.colors.surfaceHighlight },
  toggleText: { color: theme.colors.textMuted, fontWeight: '600' },
  activeToggleText: { color: theme.colors.textPrimary },
  glassCard: { backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 24, padding: theme.spacing.l, borderWidth: 1, borderColor: theme.colors.border, marginBottom: theme.spacing.m },
  urgencyCard: { backgroundColor: 'rgba(0,209,255,0.05)', borderColor: 'rgba(0,209,255,0.2)' },
  subtitle: { color: theme.colors.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1.2 },
  countdownMetric: { color: theme.colors.accentPrimary, fontSize: 48, fontWeight: '300', marginVertical: theme.spacing.s },
  subjectText: { color: theme.colors.textPrimary, fontSize: 18, fontWeight: '600' },
  analyticsRow: { flexDirection: 'row', alignItems: 'center', marginTop: theme.spacing.m },
  ringPlaceholder: { width: 64, height: 64, borderRadius: 32, borderWidth: 4, borderColor: theme.colors.success, justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.m },
  ringValue: { color: theme.colors.textPrimary, fontSize: 24, fontWeight: '700' },
  analyticsData: { flex: 1 },
  strongText: { color: theme.colors.textPrimary, fontSize: 16, fontWeight: '600', marginBottom: 4 },
  mutedDesc: { color: theme.colors.textSecondary, fontSize: 13, lineHeight: 18 },
  fab: { position: 'absolute', bottom: 32, right: 32, width: 64, height: 64, borderRadius: 32, backgroundColor: theme.colors.accentSecondary, justifyContent: 'center', alignItems: 'center', shadowColor: theme.colors.accentSecondary, shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  fabIcon: { fontSize: 24 }
});
