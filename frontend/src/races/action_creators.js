import * as dao from './dao.js';

import { startService } from './race_task';

export const REQUEST_CREATE_RACE = 'REQUEST_CREATE_RACE';
export const RECEIVE_CREATE_RACE = 'RECEIVE_CREATE_RACE';

export function requestCreateRace() {
  return {
    type: REQUEST_CREATE_RACE,
  };
}

export function receiveCreateRace(response) {
  return {
    type: RECEIVE_CREATE_RACE,
    response,
  };
}

export function createRace(keyword, agents) {
  return (dispatch, getState) => {
    dispatch(requestCreateRace());
    dao.createRace(keyword, agents)
      .then((response) => {
        dispatch(receiveCreateRace(response || {}));
        startService(dispatch, response.id);
      })
      .catch((error) => {
        console.error(error); //  eslint-disable-line no-console
        return Promise.reject({ error });
      });
  };
}

export const REQUEST_UPDATE_RACE = 'REQUEST_UPDATE_RACE';
export const RECEIVE_UPDATE_RACE = 'RECEIVE_UPDATE_RACE';

export function requestUpdateRace() {
  return {
    type: REQUEST_UPDATE_RACE,
  };
}

export function receiveUpdateRace(raceId, response) {
  return {
    type: RECEIVE_UPDATE_RACE,
    raceId,
    response,
  };
}

export function updateRace(raceId) {
  return (dispatch, getState) => {
    dispatch(requestUpdateRace());
    dao.updateRace(raceId)
      .then((response) => {
        dispatch(receiveUpdateRace(raceId, response || {}));
      })
      .catch((error) => {
        console.error(error); //  eslint-disable-line no-console
        return Promise.reject({ error });
      });
  };
}

export const REQUEST_RACES = 'REQUEST_RACES';
export const RECEIVE_RACES = 'RECEIVE_RACES';

export function requestRaces() {
  return {
    type: REQUEST_RACES,
  };
}

export function receiveRaces(response) {
  return {
    type: RECEIVE_RACES,
    response,
  };
}

export function getRaces() {
  return (dispatch, getState) => {
    dispatch(requestRaces());
    dao.getRace()
      .then((response) => {
        dispatch(receiveRaces(response));
      })
      .catch((error) => {
        console.error(error); //  eslint-disable-line no-console
        return Promise.reject({ error });
      });
  };
}

export const CHANGE_ACTIVE_RACE = 'CHANGE_ACTIVE_RACE';

export function changeActiveRace(raceId) {
  return (dispatch, getState) => {
    console.log('raceId', raceId);
    dispatch(updateRace(raceId));

    dispatch({
      type: CHANGE_ACTIVE_RACE,
      raceId,
    });
  };
}
