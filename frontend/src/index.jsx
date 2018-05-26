import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './core/app';
import makeStore from './core/store';
import { getRaces } from './races/action_creators';
import { initSocket } from './sockets/socket_service';

const store = makeStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  ,
  document.getElementById('app')
);

//  fetch all available races
store.dispatch(getRaces());

module.hot.accept();
