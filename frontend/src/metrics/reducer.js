import { fromJS } from 'immutable';

import { SET_ACTIVE_METRIC } from './action_creators';

export function getInitialState() {
  return fromJS([
    { id: 'temperature', title: 'Temperature', active: true },
    { id: 'pollution', title: 'Pollution' },
    { id: 'noise', title: 'Noise' },
  ]);
}

export function setActiveMetric(state, metric) {
  return state.map((m) => {
    return m.set('active', m.get('id') === metric);
  });
}

export default function(state = getInitialState(), action) {
  switch (action.type) {
    case SET_ACTIVE_METRIC:
      return setActiveMetric(state, action.metric);
    default:
      return state;
  }
}
