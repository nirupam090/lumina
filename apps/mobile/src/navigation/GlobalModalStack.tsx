import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';

/**
 * Global Invisible Modal Stack structurally mapping exactly the 5th Layer overrides:
 * PDF Parsing, Overleaf previews, Settings, Perms.
 */
export const GlobalModalStack = ({ isVisible, modalType, closeModal }: { isVisible: boolean, modalType: string, closeModal: () => void }) => {
  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>{modalType === 'pdf' ? 'Upload Timetable PDF' : 'FullScreen RAG Viewer'}</Text>
        
        <View style={styles.glassPlaceholder}>
           <Text style={styles.dropZoneText}>Drag or Select File...</Text>
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
          <Text style={styles.closeText}>Close Modal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
    zIndex: 9999, // Structurally overrides Native Bottom Tabs cleanly
  },
  modalContainer: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.glassmorphism.borderRadius,
    borderTopRightRadius: theme.glassmorphism.borderRadius,
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl, // Safe action bounds
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalTitle: { color: theme.colors.textPrimary, fontSize: 24, fontWeight: '700', marginBottom: theme.spacing.l },
  glassPlaceholder: {
    height: 200,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.accentPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
    backgroundColor: 'rgba(0, 209, 255, 0.05)',
  },
  dropZoneText: { color: theme.colors.accentPrimary, fontWeight: '600' },
  closeButton: { backgroundColor: theme.colors.surfaceHighlight, padding: theme.spacing.m, borderRadius: 12, alignItems: 'center' },
  closeText: { color: theme.colors.textPrimary, fontWeight: '600' }
});
