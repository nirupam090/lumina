import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { useBatteryStore } from '../store/batteryStore';

// Simulated vector database — in production this would be TensorFlow.js FAISS index
interface VectorDoc {
  id: string;
  title: string;
  pages: number;
  chunks: VectorChunk[];
}
interface VectorChunk {
  text: string;
  page: number;
  embedding: number[]; // simplified
  keywords: string[];
}

const VECTOR_DB: VectorDoc[] = [
  {
    id: '1', title: 'Deep Learning Architecture.pdf', pages: 42,
    chunks: [
      { text: 'The TFLite model leverages JSI bridging to bypass the traditional React Native bridge, reducing memory overhead by up to 40% on mobile devices. This architectural decision enables real-time inference without JavaScript thread blocking.', page: 4, embedding: [0.9, 0.3], keywords: ['jsi', 'tflite', 'bridge', 'memory', 'inference'] },
      { text: 'Convolutional Neural Networks apply learnable filters to input tensors, extracting spatial hierarchies of features. Each convolutional layer captures increasingly abstract patterns from edges to complex objects.', page: 12, embedding: [0.7, 0.5], keywords: ['cnn', 'convolutional', 'filters', 'features', 'layers'] },
      { text: 'Backpropagation computes gradients of the loss function with respect to each weight using the chain rule. These gradients drive stochastic gradient descent to minimize prediction error across training epochs.', page: 18, embedding: [0.6, 0.8], keywords: ['backpropagation', 'gradient', 'loss', 'training', 'sgd'] },
    ],
  },
  {
    id: '2', title: 'Information Retrieval Notes.pdf', pages: 84,
    chunks: [
      { text: 'Semantic vector embeddings are stored in a local FAISS index, enabling sub-50ms retrieval even on low-end hardware without network connectivity. The index uses product quantization for memory efficiency.', page: 12, embedding: [0.8, 0.4], keywords: ['vector', 'faiss', 'retrieval', 'embedding', 'offline'] },
      { text: 'TF-IDF scoring weights terms by their frequency in a document inversely proportional to their frequency across the corpus. This helps identify discriminative terms that characterize specific documents.', page: 27, embedding: [0.5, 0.6], keywords: ['tf-idf', 'scoring', 'frequency', 'terms', 'corpus'] },
      { text: 'BM25 extends TF-IDF by incorporating document length normalization and term frequency saturation, providing more robust ranking especially for longer documents with repeated terms.', page: 31, embedding: [0.4, 0.7], keywords: ['bm25', 'ranking', 'normalization', 'document'] },
    ],
  },
  {
    id: '3', title: 'NLP Fundamentals Ch.7.pdf', pages: 31,
    chunks: [
      { text: 'Attention mechanisms allow transformers to weigh input tokens dynamically, forming the backbone of modern NLP systems including BERT and GPT. Self-attention computes query-key-value projections across all positions simultaneously.', page: 23, embedding: [0.85, 0.2], keywords: ['attention', 'transformer', 'bert', 'gpt', 'nlp'] },
      { text: 'Word2Vec creates dense vector representations of words by training a shallow neural network on word co-occurrence patterns. The resulting embeddings capture semantic relationships like king - man + woman = queen.', page: 8, embedding: [0.3, 0.9], keywords: ['word2vec', 'embeddings', 'semantic', 'vectors'] },
    ],
  },
];

// Simple cosine-style keyword matching RAG (simulating VectorProcessor behavior)
function searchVectorDB(query: string): { chunk: VectorChunk; docTitle: string; score: number }[] {
  const queryWords = query.toLowerCase().split(/\s+/);
  const results: { chunk: VectorChunk; docTitle: string; score: number }[] = [];

  for (const doc of VECTOR_DB) {
    for (const chunk of doc.chunks) {
      let score = 0;
      const chunkLower = chunk.text.toLowerCase();
      for (const word of queryWords) {
        if (word.length < 3) continue;
        if (chunkLower.includes(word)) score += 0.15;
        if (chunk.keywords.some((k) => k.includes(word) || word.includes(k))) score += 0.25;
      }
      if (score > 0) {
        results.push({ chunk, docTitle: doc.title, score: Math.min(score, 0.99) });
      }
    }
  }
  return results.sort((a, b) => b.score - a.score).slice(0, 5);
}

export const SecondBrainScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ chunk: VectorChunk; docTitle: string; score: number }[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const batterySaver = useBatteryStore((s) => s.batterySaverMode);

  const handleSearch = () => {
    if (!query.trim()) return;
    if (batterySaver) {
      Alert.alert('⚡ Battery Saver', 'RAG indexing is paused to conserve battery. Results may be limited.');
    }
    setIsSearching(true);
    setHasSearched(true);
    // Simulate vector search latency
    setTimeout(() => {
      const found = searchVectorDB(query);
      setResults(found);
      setIsSearching(false);
    }, 600);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
  };

  const highlightMatch = (text: string, q: string) => {
    const words = q.toLowerCase().split(/\s+/).filter((w) => w.length >= 3);
    if (words.length === 0) return <Text style={styles.resultText}>{text}</Text>;

    const regex = new RegExp(`(${words.join('|')})`, 'gi');
    const parts = text.split(regex);

    return (
      <Text style={styles.resultText}>
        {parts.map((part, i) =>
          words.some((w) => part.toLowerCase().includes(w)) ? (
            <Text key={i} style={styles.highlight}>{part}</Text>
          ) : (
            <Text key={i}>{part}</Text>
          )
        )}
      </Text>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Second Brain</Text>
        <View style={styles.offlineBadge}>
          <View style={styles.offlineDot} />
          <Text style={styles.offlineText}>100% Offline</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>Semantic RAG — query your PDFs with AI</Text>

      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color={theme.colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Ask anything from your notes..."
          placeholderTextColor={theme.colors.textMuted}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={clearSearch}>
            <Ionicons name="close-circle" size={20} color={theme.colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Pre-search state */}
      {!hasSearched && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionLabel}>QUICK QUERIES</Text>
          {['How does JSI bridging work?', 'Explain attention mechanisms', 'What is FAISS indexing?', 'How does backpropagation work?', 'Explain TF-IDF scoring'].map((s, i) => (
            <TouchableOpacity key={i} style={styles.suggestionRow} onPress={() => { setQuery(s); }} activeOpacity={0.7}>
              <Ionicons name="sparkles-outline" size={16} color={theme.colors.accentViolet} />
              <Text style={styles.suggestionText}>{s}</Text>
            </TouchableOpacity>
          ))}

          <Text style={[styles.sectionLabel, { marginTop: 20 }]}>INDEXED DOCUMENTS ({VECTOR_DB.reduce((a, d) => a + d.chunks.length, 0)} chunks)</Text>
          {VECTOR_DB.map((doc) => (
            <View key={doc.id} style={styles.docRow}>
              <Ionicons name="document-text-outline" size={20} color={theme.colors.accentCyan} />
              <View style={{ flex: 1 }}>
                <Text style={styles.docName}>{doc.title}</Text>
                <Text style={styles.docMeta}>{doc.pages} pages · {doc.chunks.length} vectors</Text>
              </View>
              <Ionicons name="checkmark-circle" size={18} color={theme.colors.accentGreen} />
            </View>
          ))}

          {/* Overleaf Card */}
          <TouchableOpacity style={styles.overleafCard} activeOpacity={0.8} onPress={() => Alert.alert('Overleaf Preview', 'In production, this opens a WebView to your team\'s compiled LaTeX report via webhook integration.')}>
            <Ionicons name="document-text-outline" size={22} color={theme.colors.accentCyan} />
            <View style={{ flex: 1 }}>
              <Text style={styles.overleafTitle}>Overleaf LaTeX Preview</Text>
              <Text style={styles.overleafSub}>View compiled lab report from your team</Text>
            </View>
            <Ionicons name="open-outline" size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Searching */}
      {isSearching && (
        <View style={styles.loadingState}>
          <Ionicons name="sync-outline" size={32} color={theme.colors.accentViolet} />
          <Text style={styles.loadingText}>Searching local vector embeddings...</Text>
          <Text style={styles.loadingHint}>TensorFlow.js · Zero network requests</Text>
        </View>
      )}

      {/* Results */}
      {hasSearched && !isSearching && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionLabel}>{results.length} RESULT{results.length !== 1 ? 'S' : ''} FOUND</Text>

          {results.length === 0 && (
            <View style={styles.loadingState}>
              <Ionicons name="search-outline" size={32} color={theme.colors.textMuted} />
              <Text style={styles.loadingText}>No matching vectors found</Text>
              <Text style={styles.loadingHint}>Try different keywords</Text>
            </View>
          )}

          {results.map((r, i) => (
            <View key={i} style={styles.resultCard}>
              <View style={styles.confBar}>
                <View style={[styles.confFill, { width: `${r.score * 100}%` }]} />
              </View>
              {highlightMatch(r.chunk.text, query)}
              <View style={styles.resultFooter}>
                <View style={styles.sourceTag}>
                  <Ionicons name="bookmark-outline" size={11} color={theme.colors.accentBlue} />
                  <Text style={styles.sourceText}>Page {r.chunk.page}</Text>
                </View>
                <Text style={styles.docRef}>{r.docTitle}</Text>
                <Text style={styles.confText}>{(r.score * 100).toFixed(0)}%</Text>
              </View>
            </View>
          ))}
          <View style={{ height: 32 }} />
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, paddingHorizontal: 20, paddingTop: 56 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pageTitle: { color: theme.colors.textPrimary, fontSize: 28, fontWeight: '700' },
  offlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(52,211,153,0.1)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: theme.radius.full },
  offlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.accentGreen },
  offlineText: { color: theme.colors.accentGreen, fontSize: 11, fontWeight: '700' },
  subtitle: { color: theme.colors.textSecondary, fontSize: 13, marginTop: 4, marginBottom: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.borderLight, paddingHorizontal: 14, height: 48, marginBottom: 16 },
  searchInput: { flex: 1, color: theme.colors.textPrimary, fontSize: 14 },
  sectionLabel: { color: theme.colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1.2, marginBottom: 10 },
  suggestionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 6 },
  suggestionText: { color: theme.colors.textPrimary, fontSize: 13, fontWeight: '500' },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  docName: { color: theme.colors.textPrimary, fontSize: 13, fontWeight: '600' },
  docMeta: { color: theme.colors.textMuted, fontSize: 11, marginTop: 2 },
  overleafCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(78,205,196,0.06)', borderRadius: theme.radius.lg, borderWidth: 1, borderColor: 'rgba(78,205,196,0.15)', padding: 16, marginTop: 16 },
  overleafTitle: { color: theme.colors.textPrimary, fontSize: 14, fontWeight: '600' },
  overleafSub: { color: theme.colors.textSecondary, fontSize: 12, marginTop: 2 },
  loadingState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, paddingTop: 60 },
  loadingText: { color: theme.colors.textSecondary, fontSize: 14 },
  loadingHint: { color: theme.colors.textMuted, fontSize: 12 },
  resultCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, padding: 16, marginBottom: 10, overflow: 'hidden' },
  confBar: { height: 3, backgroundColor: theme.colors.surfaceHover, borderRadius: 2, marginBottom: 12 },
  confFill: { height: 3, borderRadius: 2, backgroundColor: theme.colors.accentViolet },
  resultText: { color: theme.colors.textSecondary, fontSize: 13, lineHeight: 21 },
  highlight: { color: theme.colors.textPrimary, fontWeight: '700', backgroundColor: 'rgba(157,107,255,0.15)' },
  resultFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  sourceTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(91,141,239,0.12)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: theme.radius.full },
  sourceText: { color: theme.colors.accentBlue, fontSize: 10, fontWeight: '700' },
  docRef: { color: theme.colors.textMuted, fontSize: 11, flex: 1 },
  confText: { color: theme.colors.accentViolet, fontSize: 11, fontWeight: '700' },
});
