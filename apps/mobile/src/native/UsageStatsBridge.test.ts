import { UsageStatsBridge } from './UsageStatsBridge';

describe('UsageStatsBridge (Adaptive Battery NFR)', () => {
  it('scales tracking structurally natively dropping to 10s exclusively inside Active sessions aggressively', () => {
    const bridge = new UsageStatsBridge();
    expect(bridge.calculatePollingInterval('ACTIVE', 80)).toBe(10);
  });

  it('backs off strictly to 120s if battery drops natively below 20%', () => {
    const bridge = new UsageStatsBridge();
    expect(bridge.calculatePollingInterval('PASSIVE', 15)).toBe(120);
  });
});
