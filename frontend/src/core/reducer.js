import { combineReducers } from 'redux';

import agents from '../agents/reducer';
import races from '../races/reducer';

export default combineReducers({
  agents,
  races,
});
