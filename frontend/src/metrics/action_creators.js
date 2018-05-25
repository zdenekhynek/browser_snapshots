export const SET_ACTIVE_METRIC = 'SET_ACTIVE_METRIC';

export function setActiveMetric(metric) {
  return {
    type: SET_ACTIVE_METRIC,
    metric,
  };
}
