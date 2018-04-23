import { daoFetch, formatUrl } from '../utils/dao_helpers';

export function createRace(keyword, agents) {
  const endpointUrl = 'races/';

  const method = 'POST';
  const body = { keyword, agents };
  const options = { method, body };

  const url = formatUrl(endpointUrl);
  return daoFetch(url, options);
}

//  http://127.0.0.1:8000/races/26/detail
export function updateRace(raceId) {
  const endpointUrl = 'races/';

  const method = 'GET';
  const options = { method };

  const url = formatUrl(endpointUrl, raceId);

  const completeUrl = `${url}detail`;
  return daoFetch(completeUrl, options);
}

export function getRace(keyword, agents) {
  const endpointUrl = 'races/';

  const method = 'GET';
  const options = { method };

  const url = formatUrl(endpointUrl);
  return daoFetch(url, options);
}
