import React, { useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { Navigator } from './src/navigation/Navigator';
import { theme } from './src/styles/theme';
import { useBatteryStore } from './src/store/batteryStore';

// Expo Dev Client Root strictly bootstrapping JSI bounds natively
export default function App() {

  // Global Zustand init explicitly running native loops dynamically
  const initBatteryGuardian = useBatteryStore((state: any) => state.updateBatteryLevel);

  useEffect(() => {
    // Simulated system polling startup natively bounds
    initBatteryGuardian(85);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      {/* Launch routing logic seamlessly globally */}
      <Navigator />
    </View>
  );
}
