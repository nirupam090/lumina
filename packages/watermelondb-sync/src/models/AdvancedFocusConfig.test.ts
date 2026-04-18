import { AdvancedFocusConfig } from './AdvancedFocusConfig';

describe('AdvancedFocusConfig Model', () => {
  it('maps Advanced Mode opt-in boolean directly structurally', () => {
    expect(AdvancedFocusConfig.table).toBe('advanced_focus_config');
  });
});
