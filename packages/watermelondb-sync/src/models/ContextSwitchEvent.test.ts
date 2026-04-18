import { ContextSwitchEvent } from './ContextSwitchEvent';

describe('ContextSwitchEvent Model', () => {
  it('maps directly into WatermelonDB schema safely natively', () => {
    expect(ContextSwitchEvent.table).toBe('context_switch_events');
  });
});
