import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

interface ModalProps {
  isVisible: boolean;
  modalType: 'pdf' | 'settings' | 'rag';
  closeModal: () => void;
}

const MODAL_CONFIG = {
  pdf: { title: 'Upload Timetable PDF', icon: 'document-attach-outline' as const, color: theme.colors.accentBlue },
  settings: { title: 'Settings', icon: 'settings-outline' as const, color: theme.colors.accentViolet },
  rag: { title: 'Full RAG Results', icon: 'search-outline' as const, color: theme.colors.accentCyan },
};

export const GlobalModalStack = ({ isVisible, modalType, closeModal }: ModalProps) => {
  const config = MODAL_CONFIG[modalType];

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <Pressable style={styles.backdrop} onPress={closeModal} />
      <View style={styles.sheet}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: `${config.color}20` }]}>
            <Ionicons name={config.icon} size={22} color={config.color} />
          </View>
          <Text style={styles.title}>{config.title}</Text>
          <TouchableOpacity onPress={closeModal} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Drop Zone */}
        <TouchableOpacity style={styles.dropZone} activeOpacity={0.7}>
          <Ionicons name="cloud-upload-outline" size={36} color={config.color} />
          <Text style={styles.dropTitle}>Tap to select file</Text>
          <Text style={styles.dropHint}>PDF, DOC, or image up to 25MB</Text>
        </TouchableOpacity>

        {/* Action */}
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: config.color }]} onPress={closeModal} activeOpacity={0.8}>
          <Text style={styles.actionBtnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: theme.colors.backgroundElevated,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    padding: 24,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.surfaceHover,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropZone: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.borderLight,
    backgroundColor: theme.colors.surface,
    gap: 10,
    marginBottom: 20,
  },
  dropTitle: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  dropHint: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  actionBtn: {
    borderRadius: theme.radius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionBtnText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
