const onlineUsers = new Map();

export function setOnline(username, socketId) {
  onlineUsers.set(username, socketId);
}

export function setOffline(username) {
  onlineUsers.delete(username);
}

export function listOnline() {
  return Array.from(onlineUsers.keys());
}

export function isOnline(username) {
  return onlineUsers.has(username);
}

export function getSocketId(username) {
  return onlineUsers.get(username);
}
