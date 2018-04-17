/* global window */
/* eslint no-underscore-dangle: 0 */
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import mainReducer from './reducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const makeStore = (preloadedState = {}) => {
  return createStore(
    mainReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(thunk))
  );
};

export default makeStore;
