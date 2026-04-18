import { create } from 'zustand';

interface BatteryState {
  batteryLevel: number;
  batterySaverMode: boolean;
  updateBatteryLevel: (level: number) => void;
}

export const useBatteryStore = create<BatteryState>((set) => ({
  batteryLevel: 100,
  batterySaverMode: false,
  updateBatteryLevel: (level: number) => set({
    batteryLevel: level,
    batterySaverMode: level < 15 // Soft interlock threshold inherited from Functional NFRs logically
  })
}));
