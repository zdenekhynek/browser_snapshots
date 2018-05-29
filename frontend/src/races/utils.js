/* eslint camelcase: 0 */
import { scaleLinear } from 'd3-scale';
import { Map, List } from 'immutable';

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
  //  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export function getGcpSentiment(video) {
  const { sentiment_magnitude } = video;
  return 100 - sentiment_magnitude * 100;
}

export function getSentiment(video) {
  //  add up the cap, punctionation, gcp temperature and
  const { caps_sentiment, punctuation_sentiment, sentiment_score } = video;
  const temperature = getTemperature(video);

  //  just take absolute value (any sentiment is good)
  const gcpSentiment = Math.abs(sentiment_score);

  let totalSentiment = (caps_sentiment * 100) + (punctuation_sentiment * 100) +
    (gcpSentiment * 100) + temperature;

  // clamped it to 0 -> 100
  totalSentiment = Math.min(100, Math.max(0, totalSentiment));
  return totalSentiment;
}

export function getNoise(video) {
  const { views, likes, dislikes, favorites, comment_count } = video;

  if (!views || isNaN(views)) {
    //  no views, no noise, nothing
    return 0;
  }

  const LIKES_WEIGHT = 10;
  const FAVORITE_WEIGHT = 40;
  const DISLIKES_WEIGHT = 20;
  const COMMENT_WEIGHT = 100;

  let interaction = 0;

  if (!isNaN(likes)) {
    interaction += likes * LIKES_WEIGHT;
  }

  if (!isNaN(dislikes)) {
    interaction += dislikes * DISLIKES_WEIGHT;
  }

  if (!isNaN(favorites)) {
    interaction += favorites * FAVORITE_WEIGHT;
  }

  if (!isNaN(comment_count)) {
    interaction += comment_count * COMMENT_WEIGHT;
  }

  let noise = (interaction / views) * 100;

  //  clamped noise
  noise = Math.min(100, Math.max(0, noise));
  return noise;
}

export function sumByProp(list, propName) {
  return list.reduce((acc, x) => {
    const value = x.get(propName, 0);
    const number = (isNaN(value)) ? 0 : value;
    return acc + number;
  }, 0);
}

export function getProfileResults(videos) {
  const metrics = List(['temperature', 'pollution', 'noise']);

  const videoLen = videos.size;
  return metrics.reduce((acc, metric) => {
    //  get sumByProp
    const sum = sumByProp(videos, metric);
    const avg = sum / videoLen;
    return acc.set(metric, avg);
  }, Map());
}

export function getRaceResults(videos) {
  const profiles = videos.map((vids, i) => {
    const results = getProfileResults(vids);

    //  key is converted to string for some reason, so convert it back to number
    return results.set('id', +i);
  }).toList();

  const totals = getProfileResults(profiles);

  return Map({ totals, profiles });
}
