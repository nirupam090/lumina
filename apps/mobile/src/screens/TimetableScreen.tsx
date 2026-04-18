import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, Modal, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../styles/theme';
import { BunkAnalyticsEngine } from '../native/BunkAnalyticsEngine';
import { useOfflineOCR } from '../services/OfflineOCREngine';
import { useBatteryStore } from '../store/batteryStore';

const bunkEngine = new BunkAnalyticsEngine();

type ViewMode = 'today' | 'week';
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface ClassItem {
  id: string;
  name: string;
  time: string;
  room: string;
  day: number;
  attended: boolean;
}

// Schedule starts empty — populated by OCR upload
const INITIAL_SCHEDULE: ClassItem[] = [];

export const TimetableScreen = () => {
  const { OCRWebView, processImage: runOCR, isEngineReady, progress: ocrProgress } = useOfflineOCR();

  const [viewMode, setViewMode] = useState<ViewMode>('today');
  const [selectedDay, setSelectedDay] = useState(Math.max(0, Math.min(new Date().getDay() - 1, 5)));
  const [schedule, setSchedule] = useState<ClassItem[]>(INITIAL_SCHEDULE);
  const [countdown, setCountdown] = useState('');
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'picking' | 'processing' | 'confirming' | 'done'>('idle');
  const [pickedImageUri, setPickedImageUri] = useState<string | null>(null);
  const [extractedClasses, setExtractedClasses] = useState<ClassItem[]>([]);
  const [ocrResult, setOcrResult] = useState<{ method: string; confidence: number; rawText: string; timeMs: number } | null>(null);
  const batterySaver = useBatteryStore((s) => s.batterySaverMode);

  // Live countdown
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const next = new Date();
      next.setHours(13, 0, 0, 0);
      if (now > next) next.setDate(next.getDate() + 1);
      const diff = next.getTime() - now.getTime();
      setCountdown(`${Math.floor(diff / 3600000)}h ${Math.floor((diff % 3600000) / 60000)}m`);
    };
    update();
    const t = setInterval(update, 30000);
    return () => clearInterval(t);
  }, []);

  // Real BunkAnalyticsEngine calculations
  const totalClasses = schedule.length;
  const attendedCount = schedule.filter((c) => c.attended).length;
  const bunkedCount = totalClasses - attendedCount;
  const attendancePercent = totalClasses > 0 ? (attendedCount / totalClasses) * 100 : 0;
  const safeBunks = bunkEngine.calculateRemainingBunksOffline(totalClasses, bunkedCount);
  const isAbove75 = attendancePercent >= 75;

  // Toggle attendance — re-runs BunkAnalyticsEngine
  const toggleAttendance = (id: string) => {
    setSchedule((prev) =>
      prev.map((c) => (c.id === id ? { ...c, attended: !c.attended } : c))
    );
  };

  // OCR Flow: Pick image → Process → Confirm → Add to calendar
  const startOCR = () => {
    if (batterySaver) {
      Alert.alert('⚡ Battery Saver', 'OCR parsing paused to conserve battery. Charge above 15% to continue.');
      return;
    }
    Alert.alert(
      'Upload Timetable',
      'Choose how to upload your timetable image for AI OCR processing.',
      [
        { text: 'Camera', onPress: () => pickImage('camera') },
        { text: 'Gallery', onPress: () => pickImage('gallery') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const pickImage = async (source: 'camera' | 'gallery') => {
    setOcrStatus('picking');
    try {
      let result;
      if (source === 'camera') {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) { Alert.alert('Permission needed', 'Camera access is required for OCR.'); setOcrStatus('idle'); return; }
        result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
      } else {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) { Alert.alert('Permission needed', 'Gallery access is required for OCR.'); setOcrStatus('idle'); return; }
        result = await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });
      }

      if (result.canceled) { setOcrStatus('idle'); return; }

      const uri = result.assets[0].uri;
      setPickedImageUri(uri);
      setOcrStatus('processing');

      // Process through OFFLINE Tesseract.js OCR
      runOCR(uri, (ocrData) => {
        if (!ocrData.success) {
          Alert.alert(
            'OCR Error',
            ocrData.error || 'Failed to analyze image.',
            [{ text: 'OK' }]
          );
          setOcrStatus('idle');
          return;
        }

        // Map OCR results into ClassItem format
        const now = Date.now();
        const extracted: ClassItem[] = ocrData.classes.map((ec, i) => ({
          id: `${now}_${i}`,
          name: ec.name,
          time: ec.time,
          room: ec.room,
          day: ec.day,
          attended: false,
        }));

        setExtractedClasses(extracted);
        setOcrResult({
          method: 'TESSERACT_OFFLINE',
          confidence: ocrData.confidence,
          rawText: ocrData.rawText,
          timeMs: ocrData.processingTimeMs,
        });
        setOcrStatus('confirming');
      });
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to process image. Please try again.');
      setOcrStatus('idle');
    }
  };

  const confirmExtracted = () => {
    setSchedule((prev) => [...prev, ...extractedClasses]);
    setOcrStatus('done');
    setPickedImageUri(null);
    setExtractedClasses([]);
    Alert.alert('✅ Added!', `${extractedClasses.length} classes added to your timetable.`);
    setTimeout(() => setOcrStatus('idle'), 2000);
  };

  const cancelExtracted = () => {
    setOcrStatus('idle');
    setPickedImageUri(null);
    setExtractedClasses([]);
  };

  const filtered = schedule.filter((s) => (viewMode === 'today' ? s.day === selectedDay : true));

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Schedule</Text>

        {/* View Toggle */}
        <View style={styles.toggleRow}>
          {(['today', 'week'] as ViewMode[]).map((mode) => (
            <TouchableOpacity key={mode} style={[styles.toggleBtn, viewMode === mode && styles.toggleActive]} onPress={() => setViewMode(mode)} activeOpacity={0.8}>
              <Ionicons name={mode === 'today' ? 'today-outline' : 'calendar-outline'} size={15} color={viewMode === mode ? theme.colors.white : theme.colors.textMuted} />
              <Text style={[styles.toggleText, viewMode === mode && styles.toggleTextActive]}>{mode === 'today' ? 'Today' : 'Week'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Day chips */}
        {viewMode === 'today' && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
            {DAYS.map((d, i) => (
              <TouchableOpacity key={d} style={[styles.dayChip, selectedDay === i && styles.dayChipActive]} onPress={() => setSelectedDay(i)}>
                <Text style={[styles.dayText, selectedDay === i && styles.dayTextActive]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Next Class */}
        <View style={styles.countdownCard}>
          <View style={styles.countdownLeft}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(91,141,239,0.12)' }]}>
              <Ionicons name="alarm-outline" size={20} color={theme.colors.accentBlue} />
            </View>
            <View>
              <Text style={styles.countdownLabel}>NEXT CLASS IN</Text>
              <Text style={styles.countdownValue}>{countdown}</Text>
            </View>
          </View>
          <Text style={styles.countdownSubject}>Digital Systems</Text>
        </View>

        {/* Bunk Analytics Card (BunkAnalyticsEngine) */}
        <View style={styles.bunkCard}>
          <View style={styles.bunkHeader}>
            <Ionicons name="shield-checkmark-outline" size={18} color={isAbove75 ? theme.colors.accentGreen : theme.colors.accentRed} />
            <Text style={styles.bunkTitle}>Bunk Analytics</Text>
            <Text style={[styles.bunkEngine, { color: theme.colors.textMuted }]}>BunkAnalyticsEngine</Text>
          </View>
          <View style={styles.bunkStats}>
            <View style={styles.bunkStat}>
              <Text style={[styles.bunkValue, { color: isAbove75 ? theme.colors.accentGreen : theme.colors.accentRed }]}>{attendancePercent.toFixed(1)}%</Text>
              <Text style={styles.bunkLabel}>Attendance</Text>
            </View>
            <View style={styles.bunkDivider} />
            <View style={styles.bunkStat}>
              <Text style={[styles.bunkValue, { color: safeBunks > 0 ? theme.colors.accentOrange : theme.colors.accentRed }]}>{safeBunks}</Text>
              <Text style={styles.bunkLabel}>Safe Bunks</Text>
            </View>
            <View style={styles.bunkDivider} />
            <View style={styles.bunkStat}>
              <Text style={[styles.bunkValue, { color: theme.colors.accentBlue }]}>{attendedCount}/{totalClasses}</Text>
              <Text style={styles.bunkLabel}>Attended</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.min(attendancePercent, 100)}%`, backgroundColor: isAbove75 ? theme.colors.accentGreen : theme.colors.accentRed }]} />
            <View style={styles.thresholdMark} />
          </View>
          <Text style={styles.progressHint}>↑ 75% minimum · Tap classes below to toggle attendance</Text>
        </View>

        {/* Class List */}
        <Text style={styles.sectionTitle}>{viewMode === 'today' ? `${DAYS[selectedDay]}'s Classes` : 'All Classes'}</Text>
        {filtered.length === 0 && schedule.length === 0 ? (
          <TouchableOpacity style={styles.emptyState} onPress={startOCR} activeOpacity={0.7}>
            <Ionicons name="cloud-upload-outline" size={44} color={theme.colors.accentViolet} />
            <Text style={styles.emptyTitle}>Upload Your Timetable</Text>
            <Text style={styles.emptyText}>Take a photo or pick an image of your class schedule. Our AI will extract all subjects, timings, and rooms automatically.</Text>
          </TouchableOpacity>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cafe-outline" size={36} color={theme.colors.textMuted} />
            <Text style={styles.emptyText}>No classes on this day — relax!</Text>
          </View>
        ) : (
          filtered.map((cls) => (
            <TouchableOpacity key={cls.id} style={styles.classCard} onPress={() => toggleAttendance(cls.id)} activeOpacity={0.7}>
              <View style={[styles.attendStrip, { backgroundColor: cls.attended ? theme.colors.accentGreen : theme.colors.textMuted }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.className}>{cls.name}</Text>
                <Text style={styles.classMeta}>{cls.time} · {cls.room}</Text>
              </View>
              <Ionicons name={cls.attended ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={cls.attended ? theme.colors.accentGreen : theme.colors.textMuted} />
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Hidden Tesseract.js OCR Engine */}
      <OCRWebView />

      {/* Processing Overlay */}
      {ocrStatus === 'processing' && (
        <View style={styles.processingOverlay}>
          <View style={styles.processingCard}>
            {pickedImageUri && (
              <Image source={{ uri: pickedImageUri }} style={styles.processingImage} resizeMode="cover" />
            )}
            <Ionicons name="scan-outline" size={36} color={theme.colors.accentViolet} />
            <Text style={styles.processingTitle}>Analyzing Timetable...</Text>
            <Text style={styles.processingHint}>Tesseract.js · 100% Offline OCR</Text>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${ocrProgress}%` }]} />
            </View>
            <Text style={styles.processingPercent}>{ocrProgress}%</Text>
          </View>
        </View>
      )}

      {/* OCR FAB */}
      <TouchableOpacity
        style={[styles.fab, !isEngineReady && styles.fabLoading, ocrStatus === 'processing' && styles.fabProcessing]}
        onPress={startOCR}
        activeOpacity={0.8}
        disabled={ocrStatus === 'processing' || !isEngineReady}
      >
        <Ionicons name={!isEngineReady ? 'hourglass-outline' : 'scan-outline'} size={24} color={theme.colors.white} />
        <Text style={styles.fabLabel}>{!isEngineReady ? 'Loading OCR...' : 'Upload'}</Text>
      </TouchableOpacity>

      {/* OCR Confirmation Modal */}
      <Modal visible={ocrStatus === 'confirming'} animationType="slide" transparent>
        <Pressable style={styles.modalBackdrop} onPress={cancelExtracted} />
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 500 }}>
            <Text style={styles.modalTitle}>Timetable Extracted ✅</Text>

            {/* Image Preview */}
            {pickedImageUri && (
              <Image source={{ uri: pickedImageUri }} style={styles.imagePreview} resizeMode="cover" />
            )}

            {/* OCR Stats */}
            {ocrResult && (
              <View style={styles.ocrStatsRow}>
                <View style={styles.ocrStat}>
                  <Text style={styles.ocrStatLabel}>Engine</Text>
                  <Text style={styles.ocrStatValue}>Tesseract</Text>
                </View>
                <View style={styles.ocrStat}>
                  <Text style={styles.ocrStatLabel}>Confidence</Text>
                  <Text style={[styles.ocrStatValue, { color: theme.colors.accentGreen }]}>{ocrResult.confidence.toFixed(0)}%</Text>
                </View>
                <View style={styles.ocrStat}>
                  <Text style={styles.ocrStatLabel}>Time</Text>
                  <Text style={[styles.ocrStatValue, { color: theme.colors.accentCyan }]}>{(ocrResult.timeMs / 1000).toFixed(1)}s</Text>
                </View>
                <View style={styles.ocrStat}>
                  <Text style={styles.ocrStatLabel}>Classes</Text>
                  <Text style={[styles.ocrStatValue, { color: theme.colors.accentOrange }]}>{extractedClasses.length}</Text>
                </View>
              </View>
            )}

            {/* Raw OCR Text Preview */}
            {ocrResult && ocrResult.rawText.length > 0 && (
              <TouchableOpacity
                style={styles.rawTextCard}
                onPress={() => Alert.alert('Raw OCR Output', ocrResult.rawText.substring(0, 2000))}
                activeOpacity={0.7}
              >
                <Ionicons name="code-outline" size={14} color={theme.colors.textMuted} />
                <Text style={styles.rawTextPreview} numberOfLines={2}>{ocrResult.rawText.substring(0, 150)}</Text>
                <Ionicons name="expand-outline" size={14} color={theme.colors.textMuted} />
              </TouchableOpacity>
            )}

            {/* Extracted Classes grouped by day */}
            {DAYS.slice(0, 5).map((dayName, dayIdx) => {
              const dayClasses = extractedClasses.filter(c => c.day === dayIdx);
              if (dayClasses.length === 0) return null;
              return (
                <View key={dayIdx}>
                  <Text style={styles.dayHeader}>{dayName} ({dayClasses.length} classes)</Text>
                  {dayClasses.map((cls) => (
                    <View key={cls.id} style={styles.extractedRow}>
                      <Ionicons name="book-outline" size={14} color={theme.colors.accentCyan} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.extractedName}>{cls.name}</Text>
                        <Text style={styles.extractedMeta}>{cls.time} · Room {cls.room}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              );
            })}
          </ScrollView>

          {/* Actions */}
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={cancelExtracted}>
              <Text style={styles.cancelText}>Discard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={confirmExtracted}>
              <Ionicons name="checkmark" size={18} color={theme.colors.white} />
              <Text style={styles.confirmText}>Add All {extractedClasses.length} Classes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, paddingHorizontal: 20, paddingTop: 56 },
  pageTitle: { color: theme.colors.textPrimary, fontSize: 28, fontWeight: '700', marginBottom: 16 },
  toggleRow: { flexDirection: 'row', gap: 4, backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, padding: 4, marginBottom: 14 },
  toggleBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, paddingVertical: 10, borderRadius: theme.radius.sm },
  toggleActive: { backgroundColor: theme.colors.accentViolet },
  toggleText: { color: theme.colors.textMuted, fontWeight: '600', fontSize: 13 },
  toggleTextActive: { color: theme.colors.white },
  dayChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: theme.radius.full, backgroundColor: theme.colors.surface, marginRight: 8, borderWidth: 1, borderColor: theme.colors.border },
  dayChipActive: { backgroundColor: theme.colors.accentBlue, borderColor: theme.colors.accentBlue },
  dayText: { color: theme.colors.textMuted, fontWeight: '600', fontSize: 13 },
  dayTextActive: { color: theme.colors.white },
  countdownCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(91,141,239,0.06)', borderRadius: theme.radius.lg, padding: 16, borderWidth: 1, borderColor: 'rgba(91,141,239,0.15)', marginBottom: 10 },
  countdownLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  countdownLabel: { color: theme.colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  countdownValue: { color: theme.colors.accentBlue, fontSize: 20, fontWeight: '700' },
  countdownSubject: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: '600' },
  bunkCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, padding: 18, marginBottom: 10, ...theme.shadow.card },
  bunkHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  bunkTitle: { color: theme.colors.textPrimary, fontSize: 15, fontWeight: '700', flex: 1 },
  bunkEngine: { fontSize: 9, fontWeight: '600' },
  bunkStats: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 14 },
  bunkStat: { alignItems: 'center' },
  bunkValue: { fontSize: 20, fontWeight: '700' },
  bunkLabel: { color: theme.colors.textMuted, fontSize: 10, fontWeight: '600', marginTop: 4 },
  bunkDivider: { width: 1, height: 32, backgroundColor: theme.colors.border },
  progressTrack: { height: 6, backgroundColor: theme.colors.surfaceHover, borderRadius: 3, overflow: 'visible', position: 'relative' },
  progressFill: { height: 6, borderRadius: 3 },
  thresholdMark: { position: 'absolute', top: -4, left: '75%', width: 2, height: 14, backgroundColor: theme.colors.accentOrange, borderRadius: 1 },
  progressHint: { color: theme.colors.textMuted, fontSize: 10, marginTop: 8 },
  sectionTitle: { color: theme.colors.textSecondary, fontSize: 14, fontWeight: '700', marginTop: 8, marginBottom: 10 },
  emptyState: { alignItems: 'center', paddingVertical: 36, gap: 10, backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, borderWidth: 1, borderStyle: 'dashed', borderColor: theme.colors.borderLight, marginBottom: 12, paddingHorizontal: 20 },
  emptyTitle: { color: theme.colors.textPrimary, fontSize: 18, fontWeight: '700' },
  emptyText: { color: theme.colors.textMuted, fontSize: 13, textAlign: 'center', lineHeight: 20 },
  classCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, padding: 14, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 6 },
  attendStrip: { width: 4, height: 32, borderRadius: 2 },
  className: { color: theme.colors.textPrimary, fontSize: 14, fontWeight: '600' },
  classMeta: { color: theme.colors.textSecondary, fontSize: 12, marginTop: 2 },
  fab: { position: 'absolute', bottom: 20, right: 20, height: 56, paddingHorizontal: 20, borderRadius: 28, backgroundColor: theme.colors.accentViolet, flexDirection: 'row', alignItems: 'center', gap: 8, ...theme.shadow.card },
  fabProcessing: { backgroundColor: theme.colors.accentOrange },
  fabLoading: { backgroundColor: theme.colors.textMuted, opacity: 0.8 },
  fabLabel: { color: theme.colors.white, fontWeight: '700', fontSize: 13 },

  processingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  processingCard: { backgroundColor: theme.colors.backgroundElevated, borderRadius: theme.radius.xl, padding: 32, alignItems: 'center', gap: 12, width: '85%', borderWidth: 1, borderColor: theme.colors.border },
  processingImage: { width: '100%', height: 100, borderRadius: theme.radius.md, marginBottom: 8 },
  processingTitle: { color: theme.colors.textPrimary, fontSize: 18, fontWeight: '700' },
  processingHint: { color: theme.colors.textMuted, fontSize: 12, fontWeight: '600' },
  progressBarTrack: { width: '100%', height: 6, backgroundColor: theme.colors.surfaceHover, borderRadius: 3, marginTop: 4 },
  progressBarFill: { height: 6, borderRadius: 3, backgroundColor: theme.colors.accentViolet },
  processingPercent: { color: theme.colors.accentViolet, fontSize: 14, fontWeight: '700' },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  modalSheet: { backgroundColor: theme.colors.backgroundElevated, borderTopLeftRadius: theme.radius.xl, borderTopRightRadius: theme.radius.xl, padding: 24, paddingBottom: 36, borderWidth: 1, borderColor: theme.colors.border },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: theme.colors.surfaceHover, alignSelf: 'center', marginBottom: 16 },
  modalTitle: { color: theme.colors.textPrimary, fontSize: 22, fontWeight: '700', marginBottom: 16 },
  imagePreview: { width: '100%', height: 160, borderRadius: theme.radius.md, marginBottom: 16, backgroundColor: theme.colors.surface },
  ocrStatsRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, padding: 14, marginBottom: 12 },
  ocrStat: { alignItems: 'center' },
  ocrStatLabel: { color: theme.colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  ocrStatValue: { color: theme.colors.textPrimary, fontSize: 15, fontWeight: '700' },
  rawTextCard: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: theme.colors.surface, borderRadius: theme.radius.sm, padding: 10, marginBottom: 12 },
  rawTextPreview: { color: theme.colors.textMuted, fontSize: 10, flex: 1, fontFamily: 'monospace' },
  extractedLabel: { color: theme.colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1.2, marginBottom: 10 },
  dayHeader: { color: theme.colors.accentBlue, fontSize: 13, fontWeight: '700', marginTop: 14, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 },
  extractedRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  extractedName: { color: theme.colors.textPrimary, fontSize: 14, fontWeight: '600' },
  extractedMeta: { color: theme.colors.textMuted, fontSize: 12, marginTop: 2 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  cancelBtn: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: theme.radius.md, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border },
  cancelText: { color: theme.colors.textSecondary, fontWeight: '600', fontSize: 14 },
  confirmBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderRadius: theme.radius.md, backgroundColor: theme.colors.accentViolet },
  confirmText: { color: theme.colors.white, fontWeight: '700', fontSize: 14 },
});
