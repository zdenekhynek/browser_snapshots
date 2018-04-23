import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './core/app';
import makeStore from './core/store';
import { getRaces } from './races/action_creators';

const store = makeStore();

ReactDOM.render(
  <Provider store={store}>
    <div>
      <App />
    </div>
  </Provider>
  ,
  document.getElementById('app')
);

//  fetch all available races
store.dispatch(getRaces());

module.hot.accept();
