import { scaleLinear } from 'd3-scale';

export function getTemperature(video) {
  const { likes, dislikes } = video;
  const total = likes + dislikes;
  const engagement = 1 - Math.abs((likes - dislikes) / total);

  return engagement * 200;
}

export const WEIGHT_SCALE = scaleLinear()
  .domain([0, 100 * 1000])
  .range([0.5, 1])
  .clamp(true);

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

export function getIdFromUrl(url) {
  let videoId = url.split('v=')[1];
  const ampersandPosition = videoId.indexOf('&');

  if (ampersandPosition !== -1) {
    videoId = videoId.substring(0, ampersandPosition);
  }

  return videoId;
}

export function getVideoThumbnail(url) {
  const videoId = getIdFromUrl(url);
  return `https://img.youtube.com/vi/${videoId}/0.jpg`;
}
