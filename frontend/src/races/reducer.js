import { fromJS, List, Map } from 'immutable';

import {
  RECEIVE_CREATE_RACE,
  RECEIVE_UPDATE_RACE,
  RECEIVE_RACES,
  CHANGE_ACTIVE_RACE,
} from './action_creators';

export const WAITING_STATUS = 'WAITING_STATUS';
export const IN_PROGRESS_STATUS = 'IN_PROGRESS_STATUS';
export const FINISHED_STATUS = 'FINISHED_STATUS';

export function getInitialState() {
  return List();
}

export function reduceCreateRace(state, raceId) {
  const newRace = Map({
    id: raceId,
    isActive: false,
    tasks: List(),
  });

  return state.push(newRace);
}

export function reduceUpdateRace(state, raceId, tasks) {
  const list = fromJS(tasks);
  const grouped = list.groupBy((t) => t.get('agent_id'));

  return state.map((r) => {
    if (r.get('id') === raceId) {
      return r.set('tasks', grouped);
    }

    //  return original copy
    return r;
  });
}

export function reduceRaces(response) {
  const races = fromJS(response).map((r) => {
    return r.set('isActive', false).set('tasks', List());
  });

  return races;
}

export function changeActiveRace(state, raceId) {
  return state.map((r) => {
    return r.set('isActive', r.get('id') === raceId);
  });
}

export default function(state = getInitialState(), action) {
  switch (action.type) {
    case RECEIVE_CREATE_RACE:
      const raceId = action.response.id;
      const newRaces = reduceCreateRace(state, raceId);
      return changeActiveRace(newRaces, raceId);
    case RECEIVE_UPDATE_RACE:
      return reduceUpdateRace(state, action.raceId, action.response.tasks);
    case RECEIVE_RACES:
      return reduceRaces(action.response);
    case CHANGE_ACTIVE_RACE:
      return changeActiveRace(state, action.raceId);
    default:
      return state;
  }
}