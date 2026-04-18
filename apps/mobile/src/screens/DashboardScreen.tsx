import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Alert, Share, AppState,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { useBatteryStore } from '../store/batteryStore';
import { CognitiveScoreAlgorithm } from '../services/CognitiveScoreAlgorithm';
import { BunkAnalyticsEngine } from '../native/BunkAnalyticsEngine';
import { CSVExportService } from '../native/CSVExportService';
import { StressDetectionEngine } from '../native/StressDetectionEngine';
import { UsageStatsBridge } from '../native/UsageStatsBridge';

const cogEngine = new CognitiveScoreAlgorithm();
const bunkEngine = new BunkAnalyticsEngine();
const csvExport = new CSVExportService();
const stressEngine = new StressDetectionEngine();
const usageBridge = new UsageStatsBridge();

interface Expense {
  name: string;
  amount: number;
  date: string;
}

const SUBJECTS = [
  { name: 'Data Structures', time: '10:00 AM', room: 'Room 204', icon: 'code-slash-outline' as const },
  { name: 'Quantum Mechanics', time: '12:30 PM', room: 'Lab 3B', icon: 'flask-outline' as const },
  { name: 'Digital Systems', time: '3:00 PM', room: 'Room 107', icon: 'hardware-chip-outline' as const },
];

const SAMPLE_EMAILS = [
  'Reminder: Your midterm exam is scheduled for next Monday. Please review chapters 5-8.',
  'Hello team, the deadline for the lab report submission is this Friday at 5PM. Urgent!',
  'Great news! The campus cultural fest is coming up. No academic pressure this week.',
  'Final exam schedule has been posted. Check the portal for your due date and seating.',
];

export const DashboardScreen = () => {
  const batteryLevel = useBatteryStore((s) => s.batteryLevel);
  const batterySaverMode = useBatteryStore((s) => s.batterySaverMode);
  const updateBattery = useBatteryStore((s) => s.updateBatteryLevel);

  const [cogScore, setCogScore] = useState(92);
  const [studyMinutes, setStudyMinutes] = useState(0);
  const [isStudying, setIsStudying] = useState(false);
  const [lastSwitchTime, setLastSwitchTime] = useState(Date.now());
  const [switchCount, setSwitchCount] = useState(0);
  const [greeting, setGreeting] = useState('');
  const [pollingInterval, setPollingInterval] = useState(60);

  // Expense state (wired to CSVExportService)
  const [expenses, setExpenses] = useState<Expense[]>([
    { name: 'Coffee', amount: 40, date: 'Today' },
    { name: 'Lunch', amount: 120, date: 'Today' },
    { name: 'Printouts', amount: 25, date: 'Yesterday' },
  ]);
  const [weeklyTotal, setWeeklyTotal] = useState(185);

  // Stress meter state (wired to StressDetectionEngine)
  const [stressScore, setStressScore] = useState(0);
  const [stressKeywords, setStressKeywords] = useState<string[]>([]);
  const [stressLevel, setStressLevel] = useState<'low' | 'medium' | 'high'>('low');

  // Bunk analytics (wired to BunkAnalyticsEngine)
  const [totalClasses] = useState(45);
  const [bunked] = useState(9);
  const safeBunks = bunkEngine.calculateRemainingBunksOffline(totalClasses, bunked);

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting('Good Morning');
    else if (h < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // ContextSwitch: Monitor app state changes via CognitiveScoreAlgorithm
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
        // User switched away — calculate cognitive penalty
        const secondsAway = Math.floor((Date.now() - lastSwitchTime) / 1000);
        const result = cogEngine.calculateDecayMultiplier({
          secondsAway: Math.max(secondsAway, 120), // simulate real context switch
          currentScore: cogScore,
        });
        setCogScore(Math.round(result.newScore));
        setSwitchCount((c) => c + 1);
      }
      if (nextAppState === 'active') {
        setLastSwitchTime(Date.now());
      }
      appState.current = nextAppState;
    });
    return () => sub.remove();
  }, [cogScore, lastSwitchTime]);

  // UsageStatsBridge: Adjust polling based on session + battery
  useEffect(() => {
    const interval = usageBridge.calculatePollingInterval(
      isStudying ? 'ACTIVE' : 'PASSIVE',
      batteryLevel
    );
    setPollingInterval(interval);
  }, [isStudying, batteryLevel]);

  // Stress Detection: Scan sample emails
  useEffect(() => {
    const randomEmail = SAMPLE_EMAILS[Math.floor(Math.random() * SAMPLE_EMAILS.length)];
    const result = stressEngine.parseEmailPayloadOffline(randomEmail);
    setStressScore(result.stressScore);
    setStressKeywords(result.keywords);
    setStressLevel(result.stressScore >= 50 ? 'high' : result.stressScore >= 25 ? 'medium' : 'low');
  }, []);

  // Study timer
  useEffect(() => {
    let timer: any;
    if (isStudying) {
      timer = setInterval(() => setStudyMinutes((m) => m + 1), 60000);
    }
    return () => clearInterval(timer);
  }, [isStudying]);

  const toggleStudy = () => {
    if (batterySaverMode) {
      Alert.alert('Battery Saver Active', 'Heavy tracking paused to conserve battery. Study session runs in lightweight mode.');
    }
    setIsStudying(!isStudying);
  };

  const addExpense = () => {
    const items = ['Snacks', 'Bus Fare', 'Books', 'Stationery', 'Tea', 'Xerox'];
    const name = items[Math.floor(Math.random() * items.length)];
    const amount = Math.round(10 + Math.random() * 150);
    const newExp: Expense = { name, amount, date: 'Today' };
    setExpenses((prev) => [newExp, ...prev]);
    setWeeklyTotal((t) => t + amount);
  };

  const exportWeeklyWrap = async () => {
    const csv = csvExport.buildCSVString(expenses);
    Alert.alert(
      'Weekly Student Wrap 📊',
      `You spent ₹${weeklyTotal} this week over ${expenses.length} transactions.\n\nTop spend: ${expenses.sort((a,b)=>b.amount-a.amount)[0]?.name || 'None'}\nRemaining budget is healthy!\n\nWould you like to export the raw CSV data?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export CSV', onPress: async () => {
          try {
            await Share.share({ message: csv, title: 'Lumina Weekly Wrap' });
          } catch (e) {
            Alert.alert('Export', 'CSV data:\n\n' + csv);
          }
        }}
      ]
    );
  };

  const simBattery = () => {
    const newLevel = batteryLevel <= 5 ? 85 : batteryLevel - 12;
    updateBattery(newLevel);
    if (newLevel < 15) {
      Alert.alert(
        '⚡ Smart Battery Guardian',
        'Battery below 15%!\n\n• Background RAG indexing PAUSED\n• Kanban Final Sync pushed\n• Polling interval increased to ' + usageBridge.calculatePollingInterval('PASSIVE', newLevel) + 's',
      );
    }
  };

  const simulateContextSwitch = () => {
    const penalty = cogEngine.calculateDecayMultiplier({ secondsAway: 180, currentScore: cogScore });
    setCogScore(Math.round(penalty.newScore));
    setSwitchCount((c) => c + 1);
    Alert.alert(
      'ContextSwitch Detected',
      `"You said you were studying. Your phone disagrees."\n\nPenalty multiplier: ${penalty.multiplier.toFixed(1)}x\nNew score: ${Math.round(penalty.newScore)}%\nTotal switches: ${switchCount + 1}`
    );
  };

  const STRESS_COLORS = { low: theme.colors.accentGreen, medium: theme.colors.accentOrange, high: theme.colors.accentRed };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.userName}>Nirupam ✨</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.pollBadge}>
            <Ionicons name="pulse-outline" size={14} color={theme.colors.accentCyan} />
            <Text style={styles.pollText}>{pollingInterval}s</Text>
          </View>
        </View>
      </View>

      {/* Battery Warning */}
      {batterySaverMode && (
        <View style={styles.warningBanner}>
          <Ionicons name="flash-outline" size={18} color={theme.colors.accentOrange} />
          <Text style={styles.warningText}>Battery Guardian Active — RAG indexing paused, final Kanban sync pushed</Text>
        </View>
      )}

      {/* Stress Meter (StressDetectionEngine) */}
      <View style={[styles.card, { borderColor: `${STRESS_COLORS[stressLevel]}30` }]}>
        <View style={styles.cardRow}>
          <View style={[styles.iconCircle, { backgroundColor: `${STRESS_COLORS[stressLevel]}18` }]}>
            <Ionicons name="pulse" size={20} color={STRESS_COLORS[stressLevel]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardLabel}>STRESS HEATMAP</Text>
            <Text style={[styles.bigValue, { color: STRESS_COLORS[stressLevel] }]}>{stressScore}%</Text>
          </View>
          <View style={[styles.levelBadge, { backgroundColor: `${STRESS_COLORS[stressLevel]}20` }]}>
            <Text style={[styles.levelText, { color: STRESS_COLORS[stressLevel] }]}>{stressLevel.toUpperCase()}</Text>
          </View>
        </View>
        {stressKeywords.length > 0 && (
          <View style={styles.keywordRow}>
            {stressKeywords.map((kw, i) => (
              <View key={i} style={[styles.keywordChip, { backgroundColor: `${STRESS_COLORS[stressLevel]}12` }]}>
                <Text style={[styles.keywordText, { color: STRESS_COLORS[stressLevel] }]}>{kw}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Focus Session + ContextSwitch */}
      <View style={[styles.card, styles.focusCard]}>
        <View style={styles.cardRow}>
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(91, 141, 239, 0.15)' }]}>
            <Ionicons name="timer-outline" size={20} color={theme.colors.accentBlue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardLabel}>FOCUS SESSION</Text>
            <Text style={styles.focusTime}>{studyMinutes > 0 ? `${studyMinutes} min` : 'Not started'}</Text>
          </View>
          <View style={[styles.statusDot, isStudying && styles.statusDotActive]} />
        </View>
        <View style={styles.btnRow}>
          <TouchableOpacity style={[styles.actionBtn, isStudying && styles.actionBtnStop]} onPress={toggleStudy} activeOpacity={0.8}>
            <Ionicons name={isStudying ? 'pause' : 'play'} size={16} color={theme.colors.white} />
            <Text style={styles.actionBtnText}>{isStudying ? 'Pause' : 'Start'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnOutline]} onPress={simulateContextSwitch} activeOpacity={0.8}>
            <Ionicons name="swap-horizontal-outline" size={16} color={theme.colors.accentOrange} />
            <Text style={[styles.actionBtnText, { color: theme.colors.accentOrange }]}>Sim Switch</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <TouchableOpacity style={[styles.card, styles.statCard]} onPress={simulateContextSwitch} activeOpacity={0.7}>
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(157, 107, 255, 0.15)' }]}>
            <Ionicons name="sparkles-outline" size={18} color={theme.colors.accentViolet} />
          </View>
          <Text style={[styles.statValue, { color: cogScore > 50 ? theme.colors.accentViolet : theme.colors.accentRed }]}>{cogScore}%</Text>
          <Text style={styles.statLabel}>Cognitive</Text>
          <Text style={styles.statSub}>{switchCount} switches</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, styles.statCard]} onPress={simBattery} activeOpacity={0.7}>
          <View style={[styles.iconCircle, { backgroundColor: batteryLevel < 15 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(52, 211, 153, 0.15)' }]}>
            <Ionicons name={batteryLevel < 15 ? 'battery-dead-outline' : batteryLevel < 50 ? 'battery-half-outline' : 'battery-full-outline'} size={18} color={batteryLevel < 15 ? theme.colors.accentRed : theme.colors.accentGreen} />
          </View>
          <Text style={[styles.statValue, { color: batteryLevel < 15 ? theme.colors.accentRed : theme.colors.accentGreen }]}>{batteryLevel}%</Text>
          <Text style={styles.statLabel}>Battery</Text>
          <Text style={styles.statSub}>Tap to drain</Text>
        </TouchableOpacity>

        <View style={[styles.card, styles.statCard]}>
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(78, 205, 196, 0.15)' }]}>
            <Ionicons name="shield-checkmark-outline" size={18} color={theme.colors.accentCyan} />
          </View>
          <Text style={[styles.statValue, { color: theme.colors.accentCyan }]}>{safeBunks}</Text>
          <Text style={styles.statLabel}>Safe Bunks</Text>
          <Text style={styles.statSub}>75% rule</Text>
        </View>
      </View>

      {/* Expenses (wired to CSVExportService) */}
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
            <Ionicons name="wallet-outline" size={20} color={theme.colors.accentOrange} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardLabel}>WEEKLY EXPENSES</Text>
            <Text style={[styles.bigValue, { color: theme.colors.accentOrange }]}>₹{weeklyTotal}</Text>
          </View>
          <TouchableOpacity style={styles.smallBtn} onPress={addExpense}>
            <Ionicons name="add" size={20} color={theme.colors.accentOrange} />
          </TouchableOpacity>
        </View>
        {expenses.slice(0, 3).map((e, i) => (
          <View key={i} style={styles.expenseRow}>
            <Text style={styles.expenseName}>{e.name}</Text>
            <Text style={styles.expenseAmount}>₹{e.amount}</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.exportBtn} onPress={exportWeeklyWrap} activeOpacity={0.8}>
          <Ionicons name="bar-chart-outline" size={16} color={theme.colors.accentBlue} />
          <Text style={styles.exportText}>View Weekly Student Wrap</Text>
        </TouchableOpacity>
      </View>

      {/* Upcoming Classes */}
      <Text style={styles.sectionTitle}>Upcoming Classes</Text>
      {SUBJECTS.map((subj, i) => (
        <View key={i} style={[styles.card, styles.classCard]}>
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(78, 205, 196, 0.12)' }]}>
            <Ionicons name={subj.icon} size={18} color={theme.colors.accentCyan} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.className}>{subj.name}</Text>
            <Text style={styles.classMeta}>{subj.time} · {subj.room}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={theme.colors.textMuted} />
        </View>
      ))}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, paddingHorizontal: 20, paddingTop: 56 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { color: theme.colors.textSecondary, fontSize: 14, fontWeight: '500' },
  userName: { color: theme.colors.textPrimary, fontSize: 24, fontWeight: '700', marginTop: 2 },
  headerRight: { flexDirection: 'row', gap: 8 },
  pollBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: theme.colors.surface, paddingHorizontal: 10, paddingVertical: 6, borderRadius: theme.radius.full },
  pollText: { color: theme.colors.accentCyan, fontSize: 11, fontWeight: '700' },

  warningBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(245,158,11,0.08)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.2)', borderRadius: theme.radius.md, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 12 },
  warningText: { color: theme.colors.accentOrange, fontSize: 12, fontWeight: '600', flex: 1 },

  card: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, padding: 18, marginBottom: 10, ...theme.shadow.card },
  focusCard: { borderColor: 'rgba(91,141,239,0.15)' },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardLabel: { color: theme.colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1.2 },
  bigValue: { fontSize: 26, fontWeight: '700', marginTop: 2 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  focusTime: { color: theme.colors.textPrimary, fontSize: 18, fontWeight: '600', marginTop: 2 },
  statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: theme.colors.textMuted },
  statusDotActive: { backgroundColor: theme.colors.accentGreen },

  btnRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: theme.colors.accentBlue, borderRadius: theme.radius.md, paddingVertical: 12 },
  actionBtnStop: { backgroundColor: theme.colors.accentRed },
  actionBtnOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.accentOrange },
  actionBtnText: { color: theme.colors.white, fontWeight: '700', fontSize: 13 },

  statsRow: { flexDirection: 'row', gap: 8 },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 16, paddingHorizontal: 8 },
  statValue: { fontSize: 22, fontWeight: '700', marginTop: 8 },
  statLabel: { color: theme.colors.textMuted, fontSize: 11, fontWeight: '600', marginTop: 2 },
  statSub: { color: theme.colors.textMuted, fontSize: 9, marginTop: 2 },

  levelBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: theme.radius.full },
  levelText: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  keywordRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  keywordChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: theme.radius.full },
  keywordText: { fontSize: 11, fontWeight: '600' },

  smallBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(245,158,11,0.12)', justifyContent: 'center', alignItems: 'center' },
  expenseRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: 1, borderTopColor: theme.colors.border, marginTop: 8 },
  expenseName: { color: theme.colors.textSecondary, fontSize: 14 },
  expenseAmount: { color: theme.colors.textPrimary, fontSize: 14, fontWeight: '600' },
  exportBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, paddingVertical: 10, borderRadius: theme.radius.sm, backgroundColor: 'rgba(91,141,239,0.1)' },
  exportText: { color: theme.colors.accentBlue, fontWeight: '700', fontSize: 13 },

  sectionTitle: { color: theme.colors.textSecondary, fontSize: 14, fontWeight: '700', marginTop: 8, marginBottom: 10 },
  classCard: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  className: { color: theme.colors.textPrimary, fontSize: 14, fontWeight: '600' },
  classMeta: { color: theme.colors.textSecondary, fontSize: 12, marginTop: 2 },
});
