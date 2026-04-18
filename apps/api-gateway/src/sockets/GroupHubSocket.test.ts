import { GroupHubSocket } from './GroupHubSocket';

describe('GroupHubSocket Hub Router', () => {
  it('gracefully rejects room joins if the active room capacity mathematically hits 10 natively', () => {
    const hub = new GroupHubSocket();
    // Simulate room counting natively mapping to 10 active peers dynamically
    const canJoin = hub.requestJoinRoom('squad_1', 10);
    
    expect(canJoin).toBe(false);
  });

  it('debounces the vector dispatch broadcast ensuring 100ms pipeline caps', () => {
    const hub = new GroupHubSocket();
    const mockBroadcast = jest.fn();
    
    // Simulate rapid vector emission strictly
    hub.emitVectorUpdate('squad_1', [100, 200], mockBroadcast);
    hub.emitVectorUpdate('squad_1', [105, 205], mockBroadcast);

    // Only one broadcast should penetrate the network strictly within the debounce tier natively
    expect(mockBroadcast).toHaveBeenCalledTimes(1); 
  });
});
