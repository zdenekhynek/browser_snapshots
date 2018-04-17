import { fromJS } from 'immutable';

import { RECEIVE_CREATE_RACE, RECEIVE_CHECK_RACE } from './action_creators';

export const WAITING_STATUS = 'WAITING_STATUS';
export const IN_PROGRESS_STATUS = 'IN_PROGRESS_STATUS';
export const FINISHED_STATUS = 'FINISHED_STATUS';

export function getInitialState() {
  return fromJS({
    raceId: 51,
    status: WAITING_STATUS,
    tasks: [],
  });
}

export function reduceCreateRace(state, response) {
  return state
    .set('raceId', response.id)
    .set('status', IN_PROGRESS_STATUS);
}

export function reduceCheckRace(state, tasks) {
  const list = fromJS(tasks);
  const grouped = list.groupBy((t) => t.get('agent_id'));

  return state
    .set('tasks', grouped);
}

export default function(state = getInitialState(), action) {
  switch (action.type) {
    case RECEIVE_CREATE_RACE:
      return reduceCreateRace(state, action.response);
    case RECEIVE_CHECK_RACE:
      return reduceCheckRace(state, action.response.tasks);
    default:
      return state;
  }
}
