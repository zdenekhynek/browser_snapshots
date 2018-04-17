import { checkRace } from './action_creators';

export const CHECK_INTERVAL = 1000;

let serviceInterval;
let dispatch;

export function check() {
  dispatch(checkRace());
}

export function stopService() {
  clearInterval(serviceInterval);
}

export function startService(dispatchRef) {
  dispatch = dispatchRef;

  //  just in case the old is still running
  stopService();

  serviceInterval = setInterval(check, CHECK_INTERVAL);
}
