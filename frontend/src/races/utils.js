import { scaleLinear } from 'd3-scale';

export function getTemperature(video) {
  const { likes, dislikes } = video;
  const total = likes + dislikes;
  const engagement = 1 - Math.abs((likes - dislikes) / total);

  return engagement * 100;
}

export const WEIGHT_SCALE = scaleLinear()
  .domain([0, 100 * 1000])
  .range([0.5, 1]);

export function getWeightedTemperature(video) {
  const { views } = video;
  const temperature = getTemperature(video);

  //  get weight from 1 to 10
  const weight = WEIGHT_SCALE(views);

  return temperature * weight;
}

export function getEngagementRatio(video) {
  const { views, likes, dislikes } = video;
  return views / (likes + dislikes);
}
