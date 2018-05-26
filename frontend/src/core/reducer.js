import { combineReducers } from 'redux';

import agents from '../agents/reducer';
import metrics from '../metrics/reducer';
import races from '../races/reducer';

export default combineReducers({
  agents,
  metrics,
  races,
});
