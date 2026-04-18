import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';

export const SecondBrainScreen = () => {
  return (
    <View style={styles.container}>
      
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <TextInput 
          style={styles.searchInput}
          placeholder="Ask your local knowledge base..."
          placeholderTextColor={theme.colors.textMuted}
        />
        <View style={styles.offlinePill}>
          <Text style={styles.offlineText}>100% Offline</Text>
        </View>
      </View>

      {/* Split View Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.sectionTitle}>EXTRACTED ANSWERS</Text>
        
        <View style={styles.glassCard}>
          <Text style={styles.answerText}>
             The <Text style={styles.highlight}>TFLite Native model uses JSI bridging</Text> dynamically dropping memory overhead compared to traditional RN bridges locally.
          </Text>
          
          <View style={styles.sourceFooter}>
             <View style={styles.sourceTag}>
               <Text style={styles.sourceTagText}>Source: Page 4</Text>
             </View>
             <Text style={styles.docName}>Deep Learning Architecture.pdf</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.overleafCard}>
          <Text style={styles.overleafText}>LaTeX Preview →</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, paddingTop: theme.spacing.xxl },
  searchHeader: { paddingHorizontal: theme.spacing.l, marginBottom: theme.spacing.l, position: 'relative' },
  searchInput: { backgroundColor: theme.colors.surface, width: '100%', height: 56, borderRadius: 16, color: theme.colors.textPrimary, paddingHorizontal: 20, fontSize: 16, borderWidth: 1, borderColor: theme.colors.border },
  offlinePill: { position: 'absolute', right: 36, top: 18, backgroundColor: theme.colors.surfaceHighlight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  offlineText: { color: theme.colors.accentSecondary, fontSize: 10, fontWeight: '700' },
  scrollContent: { paddingHorizontal: theme.spacing.l },
  sectionTitle: { color: theme.colors.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1.2, marginBottom: theme.spacing.s },
  glassCard: { backgroundColor: 'rgba(185, 43, 255, 0.05)', borderRadius: 24, padding: theme.spacing.l, borderWidth: 1, borderColor: 'rgba(185, 43, 255, 0.2)', marginBottom: theme.spacing.m },
  answerText: { color: theme.colors.textSecondary, fontSize: 16, lineHeight: 24 },
  highlight: { color: theme.colors.textPrimary, fontWeight: '600', backgroundColor: 'rgba(0,209,255,0.15)' },
  sourceFooter: { marginTop: theme.spacing.m, flexDirection: 'row', alignItems: 'center' },
  sourceTag: { backgroundColor: theme.colors.surfaceHighlight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginRight: theme.spacing.s },
  sourceTagText: { color: theme.colors.accentPrimary, fontSize: 12, fontWeight: '700' },
  docName: { color: theme.colors.textMuted, fontSize: 13 },
  overleafCard: { backgroundColor: theme.colors.surface, borderRadius: 16, padding: theme.spacing.l, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border },
  overleafText: { color: '#FFF', fontWeight: '600' }
});
