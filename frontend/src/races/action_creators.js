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
    dispatch(requestCreateRace(keyword));
    dao.createRace(keyword, agents)
      .then((response) => {
        dispatch(receiveCreateRace(response || {}));
        startService(dispatch);
      })
      .catch((error) => {
        console.error(error); //  eslint-disable-line no-console
        return Promise.reject({ error });
      });
  };
}

export const REQUEST_CHECK_RACE = 'REQUEST_CHECK_RACE';
export const RECEIVE_CHECK_RACE = 'RECEIVE_CHECK_RACE';

export function requestCheckRace() {
  return {
    type: REQUEST_CHECK_RACE,
  };
}

export function receiveCheckRace(response) {
  return {
    type: RECEIVE_CHECK_RACE,
    response,
  };
}

export function checkRace() {
  return (dispatch, getState) => {
    const { races } = getState();

    dispatch(requestCheckRace());
    dao.checkRace(races.get('raceId'))
      .then((response) => {
        dispatch(receiveCheckRace(response || {}));
      })
      .catch((error) => {
        console.error(error); //  eslint-disable-line no-console
        return Promise.reject({ error });
      });
  };
}
