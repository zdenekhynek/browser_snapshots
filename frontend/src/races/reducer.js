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
  getNoise,
  getPollution,
  getRaceResults,
} from './utils';

export const WAITING_STATUS = 'WAITING_STATUS';
export const IN_PROGRESS_STATUS = 'IN_PROGRESS_STATUS';
export const FINISHED_STATUS = 'FINISHED_STATUS';

export const NUM_STEPS = 12;

export function getInitialState() {
  return List();
}

export function reduceCreateRace(state, raceId, keyword) {
  const newRace = Map({
    id: raceId,
    keyword,
    isActive: false,
    tasks: List(),
  });

  return state.push(newRace);
}

export function calculateProgress(tasks) {
  if (!tasks) {
    return 0;
  }

  const progress = tasks.size / NUM_STEPS;
  const clamped = Math.min(1, Math.max(0, progress));
  return clamped;
}

export function calculateRaceProgress(raceTasks) {
  const profilesProgress = raceTasks.map((t) => calculateProgress(t));
  return profilesProgress.max();
}

export function addMetrics(tasks) {
  let sumTemperature = 0;
  let numTemperatures = 0;

  let newTasks = tasks.map((t, i) => {
    const tObj = t.toJS();

    const temperature = getTemperature(tObj);
    const noise = getNoise(tObj);
    const pollution = getPollution(tObj);

    let avgTemperature = 0;

    if (!isNaN(temperature)) {
      //  calculate total temperature

      sumTemperature += temperature;

      //  calculate avg temperature
      numTemperatures += 1;

      avgTemperature = sumTemperature / numTemperatures;
      avgTemperature = Math.min(50, avgTemperature);
    }

    return t
      .set('index', i)
      .set('temperature', temperature)
      .set('noise', noise)
      .set('pollution', pollution)
      .set('sumTemperature', sumTemperature)
      .set('avgTemperature', avgTemperature)
      .set('gcpSentiment', getGcpSentiment(tObj))
      .set('engagementRatio', getEngagementRatio(tObj))
      .set('sentiment', getSentiment(tObj));
  });

  //  slice the tasks
  //  newTasks = newTasks.slice(0, 3);

  //   limit the amount of steps
  const slicedTasks = newTasks.slice(0, NUM_STEPS);

  //  insert bogus first point
  const firstPoint = Map({ index: -0.5 });
  const lastPoint = Map({ index: NUM_STEPS - 0.5 });

  let enhancedTasks = slicedTasks.unshift(firstPoint);
  enhancedTasks = enhancedTasks.push(lastPoint);

  return enhancedTasks;
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
  let newState = state;

  const { tasks } = response;
  const list = fromJS(tasks);
  const grouped = list.groupBy((t) => t.get('agent_id')).sortBy((v, k) => k, sortAgents);

  let raceIndex = state.findIndex((r) => r.get('id') === raceId);

  if (raceIndex === -1) {
    newState = reduceCreateRace(newState, raceId);
    raceIndex = newState.size - 1;
  }

  return newState.update(raceIndex, (r) => {
    const groupedTasks = grouped.map((group) => addMetrics(group));
    const results = getRaceResults(groupedTasks);

    return r.set('tasks', groupedTasks)
      .set('keyword', response.keyword)
      .set('created_at', response.created_at)
      .set('progress', calculateRaceProgress(groupedTasks))
      .set('results', results);
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
      const keyword = action.response.keyword;
      const newRaces = reduceCreateRace(state, raceId, keyword);
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
