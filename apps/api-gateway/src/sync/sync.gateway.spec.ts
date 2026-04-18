import { SyncGateway } from './sync.gateway';
import { WsException } from '@nestjs/websockets';

describe('SyncGateway Memory Track', () => {
  let gateway: SyncGateway;

  beforeEach(() => {
    gateway = new SyncGateway();
  });

  it('test_native_node_memory_caps_connections_at_10', () => {
    const roomId = 'squad-101';
    
    // Simulate 10 successful connects mathematically
    for (let i = 0; i < 10; i++) {
      gateway.handleConnection(roomId, `user-${i}`);
    }

    // The 11th should be explicitly dropped/thrown per NFR constraints
    expect(() => gateway.handleConnection(roomId, 'user-11')).toThrow('Room capacity exceeded explicit ~10 socket limit');
  });
});
