import { updateRace } from './action_creators';

export const UPDATE_INTERVAL = 1000;

let serviceInterval;
let dispatch;
let raceId;

export function update() {
  dispatch(updateRace(raceId));
}

export function stopService() {
  clearInterval(serviceInterval);
}

export function startService(dispatchRef, raceIdRef) {
  dispatch = dispatchRef;
  raceId = raceIdRef;

  //  just in case the old is still running
  stopService();

  serviceInterval = setInterval(update, UPDATE_INTERVAL);
}
