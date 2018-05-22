import { scaleLinear } from 'd3-scale';

export function getTemperature(video) {
  const { likes, dislikes } = video;
  const total = likes + dislikes;
  const engagement = 1 - Math.abs((likes - dislikes) / total);

  return engagement * 100;
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

export function getGcpSentiment(video) {
  const { sentiment_magnitude, sentiment_score } = video;
  return 100 - sentiment_magnitude * 100;
}

export function getSentiment(video) {
  //  add up the cap, punctionation, gcp temperature and
  const { caps_sentiment, punctuation_sentiment,
    sentiment_magnitude, sentiment_score } = video;
  const temperature = getTemperature(video);

  //  just take absolute value (any sentiment is good)
  const gcpSentiment = Math.abs(sentiment_score);

  let totalSentiment = (caps_sentiment * 100) + (punctuation_sentiment * 100) +
    (gcpSentiment * 100) + temperature;

  // clamped it to 0 -> 100
  totalSentiment = Math.min(100, Math.max(0, totalSentiment));
  return totalSentiment;
}
