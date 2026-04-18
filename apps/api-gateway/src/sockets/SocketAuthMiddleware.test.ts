import { authenticateSocket } from './SocketAuthMiddleware';

describe('SocketAuthMiddleware', () => {
  it('blocks socket connections missing a native authorization token cleanly', () => {
    const mockSocket = { handshake: { auth: {} } } as any;
    const nextFn = jest.fn();

    authenticateSocket(mockSocket, nextFn);

    expect(nextFn).toHaveBeenCalledWith(new Error('Authentication Error: Missing JWT exclusively'));
  });

  it('allows connections with valid JWT structures', () => {
    const mockSocket = { handshake: { auth: { token: 'valid.jwt.string' } } } as any;
    const nextFn = jest.fn();

    authenticateSocket(mockSocket, nextFn);

    expect(nextFn).toHaveBeenCalledWith();
    expect(mockSocket.user).toBeDefined(); // Ensures the decoded role passes through properly
  });
});
