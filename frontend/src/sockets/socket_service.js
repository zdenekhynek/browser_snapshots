/* global WebSocket */

let socket;
let reconnectInterval;

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

  socket.onopen = (e) => {
    //  got the connection, clear any pending intervals
    clearInterval(reconnectInterval);
  };

  socket.onclose = (e) => {
    console.error('Chat socket closed unexpectedly');

    //  try to reconnect
    initSocket(onMessage);

    //  setup interval trying to reconnect
    reconnectInterval = setInterval(() => {
      initSocket(onMessage);
    }, 1000);
  };
}

export function sendSocketMessage(message, args) {
  console.log('sendSocketMessage', socket);
  socket.send(JSON.stringify({
    message,
    ...args,
  }));
}
