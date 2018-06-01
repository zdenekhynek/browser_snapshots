/* global WebSocket */

let socket;
let reconnectInterval;

export function getSocketServer(window) {
  const { host } = window.location;
  const protocol = (host.indexOf('127.0.0.1') > -1) ? 'ws' : 'wss';

  return `${protocol}://${host}/ws/chat/race/`;
}

export function closeSocket(socket) {
  if (socket) {
    socket.close();
  }
}

export function initSocket(onMessage) {
  console.log('initSocket');
  closeSocket(socket);

  const url = getSocketServer(window);
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
    //  disable for now
    return false;

    //  try to reconnect
    // initSocket(group, onMessage);
    // clearInterval(reconnectInterval);

    // //  setup interval trying to reconnect
    // let numTries = 0;
    // reconnectInterval = setInterval(() => {
    //   initSocket(group, onMessage);

    //   numTries += 1;

    //   if (numTries > 10) {
    //     //  too many tries, give up
    //     clearInterval(reconnectInterval);
    //   }
    // }, 2000);
  };
}

export function sendSocketMessage(message, args) {
  console.log('sendSocketMessage', socket);
  socket.send(JSON.stringify({
    message,
    ...args,
  }));
}
