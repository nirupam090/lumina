import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';

export const SquadHubScreen = () => {
  return (
    <View style={styles.container}>
      
      {/* Header & Live Indicator */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Squad Kanban</Text>
          <Text style={styles.projectText}>Term Project: Embedded AI</Text>
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.pulseDot} />
          <Text style={styles.liveText}>3 online</Text>
        </View>
      </View>

      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.boardScroll}>
        
        {/* Doing Column */}
        <View style={styles.column}>
          <Text style={styles.colTitle}>🔴 What I Am Doing</Text>
          
          <TouchableOpacity style={styles.taskCard}>
            <Text style={styles.taskTitle}>Train local RAG vectors</Text>
            <View style={styles.taskFooter}>
              <Text style={styles.assignee}>@nirupam</Text>
              <Text style={styles.timestamp}>just now</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* To Do Column */}
        <View style={styles.column}>
          <Text style={styles.colTitle}>🔵 What I Want To Do</Text>
           
          <TouchableOpacity style={[styles.taskCard, styles.inactiveCard]}>
            <Text style={styles.taskTitle}>Compile Final LaTeX Doc</Text>
            <View style={styles.taskFooter}>
              <Text style={styles.assignee}>@vatsal</Text>
              <Text style={styles.timestamp}>in 2 days</Text>
            </View>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, paddingTop: theme.spacing.xxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: theme.spacing.l, marginBottom: theme.spacing.m },
  title: { color: theme.colors.textPrimary, fontSize: 24, fontWeight: '700' },
  projectText: { color: theme.colors.textSecondary, marginTop: 4 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 59, 48, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.danger, marginRight: 6 },
  liveText: { color: theme.colors.danger, fontWeight: '600', fontSize: 13 },
  boardScroll: { paddingHorizontal: theme.spacing.m },
  column: { width: 320, paddingHorizontal: theme.spacing.s },
  colTitle: { color: theme.colors.textMuted, fontWeight: '700', letterSpacing: 1.2, marginBottom: theme.spacing.m },
  taskCard: { backgroundColor: theme.colors.surface, borderRadius: 16, padding: theme.spacing.l, borderWidth: 1, borderColor: theme.colors.border, marginBottom: theme.spacing.s },
  inactiveCard: { opacity: 0.7 },
  taskTitle: { color: theme.colors.textPrimary, fontSize: 16, fontWeight: '500', marginBottom: theme.spacing.m },
  taskFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  assignee: { color: theme.colors.accentPrimary, fontWeight: '600', fontSize: 13 },
  timestamp: { color: theme.colors.textMuted, fontSize: 12 }
});
