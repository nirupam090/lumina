import React from 'react';
import { View, StatusBar } from 'react-native';
import { Navigator } from './src/navigation/Navigator';
import { theme } from './src/styles/theme';

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <Navigator />
    </View>
  );
}
