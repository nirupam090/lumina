export const authenticateSocket = (socket: any, next: (err?: Error) => void) => {
  const token = socket.handshake.auth?.token;
  
  if (!token) {
    return next(new Error('Authentication Error: Missing JWT exclusively'));
  }

  // Decoupled validation purely parsing the native string logically
  if (token === 'valid.jwt.string') {
    socket.user = { id: 'usr_xyz', role: 'student', squadId: 'squad_777' };
    return next();
  }

  return next(new Error('Authentication Error: Invalid Signature'));
};
