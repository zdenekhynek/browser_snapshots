import { fromJS } from 'immutable';

import { UPDATE_SELECTED_AGENTS } from './action_creators';

export function getInitialState() {
  return fromJS({
    available: window.agents,
    selected: [],
  });
}

export function updateSelectedAgents(state, agents) {
  return state.set('agents', fromJS(agents));
}

export default function(state = getInitialState(), action) {
  switch (action.type) {
    case UPDATE_SELECTED_AGENTS:
      return updateSelectedAgents(state, action.agents);
    default:
      return state;
  }
}
