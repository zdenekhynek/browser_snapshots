/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import sinon from 'sinon';

import {
  getTemperature,
  getWeightedTemperature,
  getEngagementRatio,
  getGcpSentiment,
  getSentiment,
} from './utils';

describe('Races utils', () => {
  describe('getTemperature', () => {
    it('should calculate temperature correctly', () => {
      let video = {
        views: 1000, likes: 100, dislikes: 100,
      };
      let result = getTemperature(video);
      expect(result).to.be.eq(100);

      video = {
        views: 1000, likes: 200, dislikes: 0,
      };
      result = getTemperature(video);
      expect(result).to.be.eq(0);
    });
  });

  describe('getWeightedTemperature', () => {
    it('should calculate temperature correctly', () => {
      let video = {
        views: 1000, likes: 100, dislikes: 100,
      };
      let result = getWeightedTemperature(video);
      expect(result).to.be.eq(50.5);

      video = {
        views: 100000, likes: 200, dislikes: 200,
      };
      result = getWeightedTemperature(video);
      expect(result).to.be.eq(100);
    });
  });

  describe('getEngagementRatio', () => {
    it('should calculate engagementRatio correctly', () => {
      let video = {
        views: 1000, likes: 100, dislikes: 100,
      };
      let result = getEngagementRatio(video);
      expect(result).to.be.eq(5);

      video = {
        views: 1000, likes: 200, dislikes: 0,
      };
      result = getEngagementRatio(video);
      expect(result).to.be.eq(5);
    });
  });

  describe('getGcpSentiment', () => {
    it('should calculate sentiment', () => {
      let video = {
        sentiment_magnitude: -1, sentiment_score: 1,
      };
      let result = getGcpSentiment(video);
      expect(result).to.be.eq(200);

      video = {
        sentiment_magnitude: 1, sentiment_score: 1,
      };
      result = getGcpSentiment(video);
      expect(result).to.be.eq(0);

      video = {
        sentiment_magnitude: 0, sentiment_score: 0,
      };
      result = getGcpSentiment(video);
      expect(result).to.be.eq(100);
    });
  });

  describe('getSentiment', () => {
    it('should calculate sentiment', () => {
      let video = {
        sentiment_magnitude: -1, sentiment_score: 1,
      };
      let result = getSentiment(video);
      expect(result).to.be.eq(200);

      video = {
        sentiment_magnitude: 1, sentiment_score: 1,
      };
      result = getSentiment(video);
      expect(result).to.be.eq(0);

      video = {
        sentiment_magnitude: 0, sentiment_score: 0,
      };
      result = getSentiment(video);
      expect(result).to.be.eq(100);
    });
  });
});
