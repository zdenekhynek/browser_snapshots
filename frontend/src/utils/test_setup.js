import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import chai from 'chai';
import chaiImmutable from 'chai-immutable';

chai.use(chaiImmutable);
