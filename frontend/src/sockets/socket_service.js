/* global WebSocket */

let socket;
let reconnectInterval;
let numReconnectTries = 0;

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
    numReconnectTries = 0;
  };

  socket.onclose = (e) => {
    console.error('Chat socket closed unexpectedly', numReconnectTries);

    //  try to reconnect
    clearInterval(reconnectInterval);

    //  setup interval trying to reconnect
    reconnectInterval = setInterval(() => {
      initSocket(onMessage);

      numReconnectTries += 1;

      if (numReconnectTries > 50) {
        //  too many tries, give up
        //  wait for manual promp for reconnecting
        clearInterval(reconnectInterval);
        const shouldReconnect = window.confirm('Disconnected. Try to reconnect?');
        if (shouldReconnect) {
          //  trying reconnecting
          initSocket(onMessage);
        }
      }
    }, 2000);
  };
}

export function sendSocketMessage(message, args) {
  console.log('sendSocketMessage', socket);
  socket.send(JSON.stringify({
    message,
    ...args,
  }));
}
