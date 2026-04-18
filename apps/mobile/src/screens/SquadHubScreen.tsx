import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { KanbanTimeStamper } from '../native/KanbanTimeStamper.socket';
import { useBatteryStore } from '../store/batteryStore';

const kanbanSocket = new KanbanTimeStamper();

interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: 'low' | 'mid' | 'high';
  timestamp: string;
  server_sync_timestamp?: number;
}

const PRIORITY_COLORS = {
  low: theme.colors.accentCyan,
  mid: theme.colors.accentOrange,
  high: theme.colors.accentRed,
};

const ONLINE_USERS = [
  { name: 'Nirupam', color: theme.colors.accentViolet },
  { name: 'Vatsal', color: theme.colors.accentBlue },
  { name: 'Renee', color: theme.colors.accentPink },
];

export const SquadHubScreen = () => {
  const [doing, setDoing] = useState<Task[]>([
    { id: '1', title: 'Train local RAG vectors on lecture PDFs', assignee: 'nirupam', priority: 'high', timestamp: '2m ago' },
    { id: '2', title: 'Fix SQLite sync conflict on Android', assignee: 'vatsal', priority: 'mid', timestamp: '18m ago' },
  ]);
  const [todo, setTodo] = useState<Task[]>([
    { id: '3', title: 'Compile final LaTeX report for submission', assignee: 'renee', priority: 'mid', timestamp: 'in 2 days' },
    { id: '4', title: 'Add expense CSV export feature', assignee: 'nirupam', priority: 'low', timestamp: 'in 3 days' },
    { id: '5', title: 'UI testing on low-end devices', assignee: 'vatsal', priority: 'high', timestamp: 'tomorrow' },
  ]);
  const [done, setDone] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'mid' | 'high'>('mid');
  const batterySaver = useBatteryStore((s) => s.batterySaverMode);

  // Move task with KanbanTimeStamper server relay stamp
  const moveToDoingTask = (task: Task) => {
    const serverEpoch = Date.now(); // In production: received from Socket.io server
    const stamped = kanbanSocket.injectServerRelayStamp(
      { ...task, timestamp: 'just now' },
      serverEpoch
    );
    setTodo((prev) => prev.filter((t) => t.id !== task.id));
    setDoing((prev) => [stamped, ...prev]);

    if (batterySaver) {
      Alert.alert('⚡ Final Sync', 'Battery < 15% — this task update was force-synced to the team before battery dies.');
    }
  };

  const moveToDone = (task: Task) => {
    const serverEpoch = Date.now();
    const stamped = kanbanSocket.injectServerRelayStamp(
      { ...task, timestamp: 'completed' },
      serverEpoch
    );
    setDoing((prev) => prev.filter((t) => t.id !== task.id));
    setDone((prev) => [stamped, ...prev]);
  };

  const undoTask = (task: Task) => {
    setDone((prev) => prev.filter((t) => t.id !== task.id));
    setTodo((prev) => [{ ...task, timestamp: 'restored' }, ...prev]);
  };

  const addTask = () => {
    if (!newTaskText.trim()) return;
    const serverEpoch = Date.now();
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskText.trim(),
      assignee: 'nirupam',
      priority: selectedPriority,
      timestamp: 'just now',
    };
    const stamped = kanbanSocket.injectServerRelayStamp(newTask, serverEpoch);
    setTodo((prev) => [stamped, ...prev]);
    setNewTaskText('');
    setShowInput(false);
  };

  const shareBoard = async () => {
    const lines = [
      '📋 Lumina Kanban Board',
      `\n🔴 In Progress (${doing.length}):`,
      ...doing.map((t) => `  • ${t.title} (@${t.assignee})`),
      `\n🔵 To Do (${todo.length}):`,
      ...todo.map((t) => `  • ${t.title} (@${t.assignee})`),
      `\n✅ Done (${done.length}):`,
      ...done.map((t) => `  • ${t.title}`),
    ];
    await Share.share({ message: lines.join('\n') });
  };

  const renderTask = (task: Task, type: 'doing' | 'todo' | 'done') => (
    <View key={task.id} style={styles.taskCard}>
      <View style={[styles.priorityStrip, { backgroundColor: PRIORITY_COLORS[task.priority] }]} />
      <View style={styles.taskBody}>
        <Text style={[styles.taskTitle, type === 'done' && styles.taskDone]}>{task.title}</Text>
        <View style={styles.taskMeta}>
          <View style={styles.assigneeChip}>
            <Ionicons name="person-outline" size={11} color={theme.colors.textSecondary} />
            <Text style={styles.assigneeText}>@{task.assignee}</Text>
          </View>
          <Text style={styles.taskTime}>{task.timestamp}</Text>
          {task.server_sync_timestamp && (
            <Ionicons name="cloud-done-outline" size={12} color={theme.colors.accentGreen} />
          )}
        </View>
      </View>
      {type === 'todo' && (
        <TouchableOpacity style={styles.taskAction} onPress={() => moveToDoingTask(task)}>
          <Ionicons name="arrow-forward-circle-outline" size={26} color={theme.colors.accentBlue} />
        </TouchableOpacity>
      )}
      {type === 'doing' && (
        <TouchableOpacity style={styles.taskAction} onPress={() => moveToDone(task)}>
          <Ionicons name="checkmark-circle-outline" size={26} color={theme.colors.accentGreen} />
        </TouchableOpacity>
      )}
      {type === 'done' && (
        <TouchableOpacity style={styles.taskAction} onPress={() => undoTask(task)}>
          <Ionicons name="arrow-undo-outline" size={22} color={theme.colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Squad Hub</Text>
          <Text style={styles.projectName}>Term Project: Embedded AI</Text>
        </View>
        <TouchableOpacity onPress={shareBoard} style={styles.shareBtn}>
          <Ionicons name="share-outline" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Online */}
      <View style={styles.onlineBar}>
        <View style={styles.liveDot} />
        <View style={styles.avatarStack}>
          {ONLINE_USERS.map((u, i) => (
            <View key={u.name} style={[styles.avatar, { backgroundColor: u.color, marginLeft: i > 0 ? -8 : 0, zIndex: 3 - i }]}>
              <Text style={styles.avatarLetter}>{u.name[0]}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.onlineText}>{ONLINE_USERS.length} online</Text>
        {batterySaver && <Ionicons name="flash-outline" size={14} color={theme.colors.accentOrange} />}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* In Progress */}
        <View style={styles.colHeader}>
          <View style={styles.colHeaderLeft}>
            <View style={[styles.colDot, { backgroundColor: theme.colors.accentOrange }]} />
            <Text style={styles.colTitle}>In Progress</Text>
          </View>
          <View style={styles.countBadge}><Text style={styles.countText}>{doing.length}</Text></View>
        </View>
        {doing.map((t) => renderTask(t, 'doing'))}

        {/* To Do */}
        <View style={[styles.colHeader, { marginTop: 18 }]}>
          <View style={styles.colHeaderLeft}>
            <View style={[styles.colDot, { backgroundColor: theme.colors.accentBlue }]} />
            <Text style={styles.colTitle}>To Do</Text>
          </View>
          <View style={styles.countBadge}><Text style={styles.countText}>{todo.length}</Text></View>
        </View>
        {todo.map((t) => renderTask(t, 'todo'))}

        {/* Add task */}
        {showInput ? (
          <View style={styles.addRow}>
            <TextInput style={styles.addInput} placeholder="What needs to be done?" placeholderTextColor={theme.colors.textMuted} value={newTaskText} onChangeText={setNewTaskText} onSubmitEditing={addTask} autoFocus />
            <View style={styles.priorityRow}>
              {(['low', 'mid', 'high'] as const).map((p) => (
                <TouchableOpacity key={p} style={[styles.priBtn, selectedPriority === p && { backgroundColor: `${PRIORITY_COLORS[p]}30`, borderColor: PRIORITY_COLORS[p] }]} onPress={() => setSelectedPriority(p)}>
                  <Text style={[styles.priText, { color: PRIORITY_COLORS[p] }]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.confirmBtn} onPress={addTask}>
              <Ionicons name="checkmark" size={20} color={theme.colors.white} />
              <Text style={styles.confirmText}>Add Task</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowInput(true)} activeOpacity={0.7}>
            <Ionicons name="add-circle-outline" size={18} color={theme.colors.accentViolet} />
            <Text style={styles.addText}>Add a task</Text>
          </TouchableOpacity>
        )}

        {/* Done */}
        {done.length > 0 && (
          <>
            <View style={[styles.colHeader, { marginTop: 18 }]}>
              <View style={styles.colHeaderLeft}>
                <View style={[styles.colDot, { backgroundColor: theme.colors.accentGreen }]} />
                <Text style={styles.colTitle}>Done</Text>
              </View>
              <View style={styles.countBadge}><Text style={styles.countText}>{done.length}</Text></View>
            </View>
            {done.map((t) => renderTask(t, 'done'))}
          </>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, paddingHorizontal: 20, paddingTop: 56 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  pageTitle: { color: theme.colors.textPrimary, fontSize: 28, fontWeight: '700' },
  projectName: { color: theme.colors.textSecondary, fontSize: 13, marginTop: 4 },
  shareBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.surface, justifyContent: 'center', alignItems: 'center' },

  onlineBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(239,68,68,0.06)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.15)', borderRadius: theme.radius.md, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 16 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.accentRed },
  avatarStack: { flexDirection: 'row' },
  avatar: { width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: theme.colors.background },
  avatarLetter: { color: theme.colors.white, fontSize: 11, fontWeight: '700' },
  onlineText: { color: theme.colors.accentRed, fontSize: 12, fontWeight: '600', flex: 1 },

  colHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  colHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  colDot: { width: 10, height: 10, borderRadius: 5 },
  colTitle: { color: theme.colors.textPrimary, fontSize: 15, fontWeight: '700' },
  countBadge: { backgroundColor: theme.colors.surfaceHover, paddingHorizontal: 10, paddingVertical: 3, borderRadius: theme.radius.full },
  countText: { color: theme.colors.textSecondary, fontSize: 11, fontWeight: '700' },

  taskCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 6, overflow: 'hidden' },
  priorityStrip: { width: 4, alignSelf: 'stretch' },
  taskBody: { flex: 1, padding: 14 },
  taskTitle: { color: theme.colors.textPrimary, fontSize: 13, fontWeight: '600', lineHeight: 19 },
  taskDone: { textDecorationLine: 'line-through', color: theme.colors.textMuted },
  taskMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  assigneeChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: theme.colors.surfaceHover, paddingHorizontal: 6, paddingVertical: 2, borderRadius: theme.radius.full },
  assigneeText: { color: theme.colors.textSecondary, fontSize: 10, fontWeight: '600' },
  taskTime: { color: theme.colors.textMuted, fontSize: 10 },
  taskAction: { padding: 14 },

  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, paddingHorizontal: 14, borderRadius: theme.radius.md, borderWidth: 1, borderStyle: 'dashed', borderColor: theme.colors.border, marginTop: 4 },
  addText: { color: theme.colors.accentViolet, fontWeight: '600', fontSize: 13 },
  addRow: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, padding: 14, borderWidth: 1, borderColor: theme.colors.borderLight, marginTop: 4, gap: 10 },
  addInput: { backgroundColor: theme.colors.surfaceHover, borderRadius: theme.radius.sm, color: theme.colors.textPrimary, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13 },
  priorityRow: { flexDirection: 'row', gap: 6 },
  priBtn: { flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: theme.radius.sm, borderWidth: 1, borderColor: theme.colors.border },
  priText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  confirmBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: theme.colors.accentViolet, borderRadius: theme.radius.sm, paddingVertical: 10 },
  confirmText: { color: theme.colors.white, fontWeight: '700', fontSize: 13 },
});
