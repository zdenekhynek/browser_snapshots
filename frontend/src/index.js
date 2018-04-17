import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './core/app';
import makeStore from './core/store';
import { checkRace } from './races/action_creators';

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

store.dispatch(checkRace());

module.hot.accept();
