import { daoFetch, formatUrl } from '../utils/dao_helpers';

import data from '../fake_data';

export function createRace(keyword, agents) {
  const endpointUrl = 'api/races/';

  const method = 'POST';
  const body = { keyword, agents };
  const options = { method, body };

  const url = formatUrl(endpointUrl);
  return daoFetch(url, options);
}

//  http://127.0.0.1:8000/races/26/detail
export function updateRace(raceId) {
  //  return Promise.resolve(data);
  
  const endpointUrl = 'api/races/';

  const method = 'GET';
  const options = { method };


  const url = formatUrl(endpointUrl, raceId);

  const completeUrl = `${url}detail`;
  return daoFetch(completeUrl, options);
}

export function getRace(highlightedOnly = false) {
  const endpointUrl = 'api/races/';

  const method = 'GET';
  const options = { method };
  const params = (highlightedOnly) ? { highlightedOnly } : {};

  const url = formatUrl(endpointUrl, null, params);
  return daoFetch(url, options);
}
