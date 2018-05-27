/* global WebSocket */

let socket;

export function getSocketServer(window, group) {
  const { host } = window.location;
  const protocol = (host.indexOf('127.0.0.1') > -1) ? 'ws' : 'wss';

  return `${protocol}://${host}/ws/chat/${group}/`;
}

export function closeSocket(socket) {
  if (socket) {
    socket.close();
  }
}

export function initSocket(group, onMessage) {
  closeSocket(socket);

  const url = getSocketServer(window, group);
  socket = new WebSocket(url);
  addSocketCallbacks(socket, onMessage);
}

export function addSocketCallbacks(socket, onMessage) {
  socket.onmessage = (e) => {
    onMessage(JSON.parse(e.data));
  };

  socket.onclose = (e) => {
    console.error('Chat socket closed unexpectedly');
  };
}

export function sendSocketMessage(message) {
  console.log('sendSocketMessage', socket);
  socket.send(JSON.stringify({
    message,
  }));
}
