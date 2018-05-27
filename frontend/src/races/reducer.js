import { fromJS, List, Map } from 'immutable';

import {
  RECEIVE_CREATE_RACE,
  RECEIVE_UPDATE_RACE,
  RECEIVE_RACES,
  CHANGE_ACTIVE_RACE,
} from './action_creators';
import {
  getTemperature,
  getEngagementRatio,
  getGcpSentiment,
  getSentiment,
} from './utils';

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

export function addMetrics(tasks) {
  let sumTemperature = 0;
  let numTemperatures = 0;

  return tasks.map((t) => {
    const tObj = t.toJS();

    const temperature = getTemperature(tObj);

    let avgTemperature = 36;

    if (!Number.isNaN(temperature)) {
      //  calculate total temperature

      sumTemperature += temperature;

      //  calculate avg temperature
      numTemperatures += 1;

      avgTemperature = sumTemperature / numTemperatures;
      avgTemperature = Math.min(50, avgTemperature);
    }

    return t
      .set('temperature', temperature)
      .set('sumTemperature', sumTemperature)
      .set('avgTemperature', avgTemperature)
      .set('gcpSentiment', getGcpSentiment(tObj))
      .set('engagementRatio', getEngagementRatio(tObj))
      .set('sentiment', getSentiment(tObj));
  });
}

export function sortAgents(a, b) {
  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  }

  return 0;
}

export function reduceUpdateRace(state, raceId, response) {
  console.log('reduceUpdateRace', raceId, response);
  let newState = state;

  const { tasks } = response;
  const list = fromJS(tasks);
  const grouped = list.groupBy((t) => t.get('agent_id')).sortBy((v, k) => k, sortAgents);

  let raceIndex = state.findIndex((r) => r.get('id') === raceId);

  if (raceIndex === -1) {
    newState = reduceCreateRace(newState, raceId);
    raceIndex = newState.size - 1;
  }

  console.log('newState', newState);

  return newState.update(raceIndex, (r) => {
    return r.set('tasks', grouped.map((group) => addMetrics(group)))
      .set('keyword', response.keyword)
      .set('created_at', response.created_at);
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
      return reduceUpdateRace(state, action.raceId, action.response);
    case RECEIVE_RACES:
      return reduceRaces(action.response);
    case CHANGE_ACTIVE_RACE:
      return changeActiveRace(state, action.raceId);
    default:
      return state;
  }
}
