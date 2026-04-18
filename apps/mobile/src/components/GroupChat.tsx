import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

interface Message {
  id: string;
  user: string;
  text: string;
  isMe: boolean;
  timestamp: string;
  isSnippet?: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  { id: '1', user: 'Renee', text: 'Hey guys, did anyone manage to get the SQLite sync working?', isMe: false, timestamp: '10:42 AM' },
  { id: '2', user: 'Vatsal', text: 'I tried, but the conflict resolution is tricky offline.', isMe: false, timestamp: '10:45 AM' },
  { id: '3', user: 'Renee', text: 'I wrote a custom resolver. I will pin it to the pasteboard.', isMe: false, timestamp: '10:46 AM' },
];

export const GroupChat = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [showPasteboard, setShowPasteboard] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      user: 'Nirupam',
      text: inputText,
      isMe: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderWhiteboard = () => (
    <View style={styles.overlayContainer}>
      <View style={styles.overlayHeader}>
        <View style={styles.overlayTitleRow}>
          <Ionicons name="color-palette-outline" size={20} color={theme.colors.accentCyan} />
          <Text style={styles.overlayTitle}>Shared Whiteboard</Text>
        </View>
        <TouchableOpacity onPress={() => setShowWhiteboard(false)}>
          <Ionicons name="close-circle" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>
      <View style={styles.canvasArea}>
        <Ionicons name="pencil-outline" size={32} color={theme.colors.textMuted} style={styles.canvasIcon} />
        <Text style={styles.canvasText}>Logic Gate Sketch #4</Text>
        <Text style={styles.canvasSubtext}>Real-time drawing is active. Vatsal is currently sketching.</Text>
      </View>
    </View>
  );

  const renderPasteboard = () => (
    <View style={styles.overlayContainer}>
      <View style={styles.overlayHeader}>
        <View style={styles.overlayTitleRow}>
          <Ionicons name="clipboard-outline" size={20} color={theme.colors.accentOrange} />
          <Text style={styles.overlayTitle}>Team Pasteboard</Text>
        </View>
        <TouchableOpacity onPress={() => setShowPasteboard(false)}>
          <Ionicons name="close-circle" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.pasteboardContent}>
        <View style={styles.snippetCard}>
          <View style={styles.snippetHeader}>
            <Text style={styles.snippetAuthor}>Pinned by @Renee</Text>
            <Ionicons name="copy-outline" size={14} color={theme.colors.textSecondary} />
          </View>
          <Text style={styles.snippetCode}>
            {`function resolveSyncConflict(local, remote) {\n  if (local.timestamp > remote.timestamp) {\n    return local;\n  }\n  return remote;\n}`}
          </Text>
        </View>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Messages */}
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.chatScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.chatInfoBadge}>
          <Ionicons name="lock-closed" size={12} color={theme.colors.accentGreen} />
          <Text style={styles.chatInfoText}>End-to-end encrypted local mesh chat</Text>
        </View>
        {messages.map((msg) => (
          <View key={msg.id} style={[styles.messageWrapper, msg.isMe ? styles.messageWrapperMe : styles.messageWrapperThem]}>
            {!msg.isMe && <Text style={styles.messageUser}>{msg.user}</Text>}
            <View style={[styles.messageBubble, msg.isMe ? styles.messageBubbleMe : styles.messageBubbleThem]}>
              <Text style={styles.messageText}>{msg.text}</Text>
            </View>
            <Text style={styles.messageTime}>{msg.timestamp}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Overlays */}
      {showWhiteboard && renderWhiteboard()}
      {showPasteboard && renderPasteboard()}

      {/* Input Area */}
      <View style={styles.inputArea}>
        <TouchableOpacity style={styles.utilityBtn} onPress={() => { setShowPasteboard(!showPasteboard); setShowWhiteboard(false); }}>
          <Ionicons name="clipboard" size={20} color={showPasteboard ? theme.colors.accentOrange : theme.colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.utilityBtn} onPress={() => { setShowWhiteboard(!showWhiteboard); setShowPasteboard(false); }}>
          <Ionicons name="color-palette" size={20} color={showWhiteboard ? theme.colors.accentCyan : theme.colors.textSecondary} />
        </TouchableOpacity>
        
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={theme.colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={sendMessage}
          />
        </View>
        
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Ionicons name="send" size={18} color={theme.colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  chatScroll: { paddingVertical: 20 },
  chatInfoBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', gap: 6, backgroundColor: 'rgba(52, 211, 153, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: theme.radius.full, marginBottom: 20 },
  chatInfoText: { color: theme.colors.accentGreen, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  messageWrapper: { marginBottom: 16, maxWidth: '80%' },
  messageWrapperMe: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  messageWrapperThem: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  messageUser: { color: theme.colors.textSecondary, fontSize: 11, fontWeight: '600', marginBottom: 4, marginLeft: 2 },
  messageBubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: theme.radius.lg },
  messageBubbleMe: { backgroundColor: theme.colors.accentViolet, borderBottomRightRadius: 4 },
  messageBubbleThem: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.borderLight, borderBottomLeftRadius: 4 },
  messageText: { color: theme.colors.textPrimary, fontSize: 14, lineHeight: 20 },
  messageTime: { color: theme.colors.textMuted, fontSize: 10, marginTop: 4 },
  
  inputArea: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, borderTopWidth: 1, borderTopColor: theme.colors.border },
  utilityBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: theme.colors.surfaceHover, justifyContent: 'center', alignItems: 'center' },
  inputWrapper: { flex: 1, backgroundColor: theme.colors.surfaceHover, borderRadius: theme.radius.full, paddingHorizontal: 16, height: 40, justifyContent: 'center' },
  input: { color: theme.colors.textPrimary, fontSize: 14 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.accentBlue, justifyContent: 'center', alignItems: 'center', paddingLeft: 4 },

  overlayContainer: { position: 'absolute', bottom: 70, left: 0, right: 0, height: 300, backgroundColor: theme.colors.backgroundElevated, borderRadius: theme.radius.xl, borderWidth: 1, borderColor: theme.colors.border, padding: 16, ...theme.shadow.card },
  overlayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  overlayTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  overlayTitle: { color: theme.colors.textPrimary, fontSize: 16, fontWeight: '700' },
  
  canvasArea: { flex: 1, backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, borderWidth: 1, borderStyle: 'dashed', borderColor: theme.colors.borderLight, justifyContent: 'center', alignItems: 'center' },
  canvasIcon: { marginBottom: 12 },
  canvasText: { color: theme.colors.textPrimary, fontSize: 16, fontWeight: '600' },
  canvasSubtext: { color: theme.colors.textMuted, fontSize: 12, marginTop: 8 },

  pasteboardContent: { flex: 1 },
  snippetCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, padding: 12, borderWidth: 1, borderColor: theme.colors.border },
  snippetHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  snippetAuthor: { color: theme.colors.accentOrange, fontSize: 11, fontWeight: '700' },
  snippetCode: { color: theme.colors.textSecondary, fontSize: 12, fontFamily: 'monospace', lineHeight: 18 },
});
