import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import chai from 'chai';
import chaiImmutable from 'chai-immutable';

chai.use(chaiImmutable);

// Create no-op function and assign to require extensions that would otherwise
// break mocha without appropriate mock loader
const noOp = () => { return null; };
require.extensions['.css'] = noOp;
require.extensions['.png'] = noOp;
