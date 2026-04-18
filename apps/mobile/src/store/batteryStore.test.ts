import { useBatteryStore } from './batteryStore';

describe('Battery Guardian Zustand Metrics', () => {
  it('test_guardian_toggles_safemode_under_15_percent', () => {
    // Asserting the battery threshold mathematically locks the state globally
    const toggleBattery = useBatteryStore.getState().updateBatteryLevel;
    
    // Simulate drop beneath explicit limit
    toggleBattery(14); 
    expect(useBatteryStore.getState().batterySaverMode).toBe(true);
    
    // Simulate recovery
    toggleBattery(25);
    expect(useBatteryStore.getState().batterySaverMode).toBe(false);
  });
});
