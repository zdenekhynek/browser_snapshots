/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import sinon from 'sinon';
import { fromJS, Map, OrderedMap } from 'immutable';

import {
  getTemperature,
  getWeightedTemperature,
  getEngagementRatio,
  getGcpSentiment,
  getSentiment,
  getNoise,
  getPollution,
  getProfileResults,
  getRaceResults,
} from './utils';

describe('Races utils', () => {
  describe('getTemperature', () => {
    it('should calculate temperature correctly', () => {
      let video = {
        views: 1000, likes: 100, dislikes: 10,
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
    xit('should calculate sentiment', () => {
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

  describe('getNoise', () => {
    it('should calculate noise', () => {
      let video = {
        views: 1000,
        likes: 10,
        dislikes: 1,
        favorites: 0,
        comment_count: 0,
      };

      expect(getNoise(video) > 10).to.be.true;

      video = {
        views: 1000,
        likes: 10,
        dislikes: 10,
        favorites: 0,
        comment_count: 10,
      };

      expect(getNoise(video)).to.eq(100);
    });

    it('should deal with non standard values', () => {
      let video = {
        views: 0,
        likes: 10,
        dislikes: 1,
        favorites: 0,
        comment_count: 0,
      };

      expect(getNoise(video)).to.eq(0);

      video = {
        views: 1000,
        likes: 'fasdas',
        dislikes: 'asdfasd',
        favorites: false,
        comment_count: 10,
      };

      expect(getNoise(video)).to.eq(100);

      video = {
        views: 'asdfas',
        likes: 'fasdas',
        dislikes: 'asdfasd',
        favorites: false,
        comment_count: 10,
      };

      expect(getNoise(video)).to.eq(0);
    });
  });

  describe('getPollution', () => {
    it('should calculate pollution', () => {
      console.log('get pollution');
      let video = {
        fakebox_title_decision: 'bias',
        fakebox_title_score: 0,
      };

      expect(getPollution(video)).to.eq(50);

      video = {
        fakebox_title_decision: 'bias',
        fakebox_title_score: 0.5,
      };
      expect(getPollution(video)).to.eq(100);

      video = {
        fakebox_title_decision: 'bias',
        fakebox_title_score: 1,
      };
      expect(getPollution(video)).to.eq(100);

      video = {
        fakebox_title_decision: 'unsure',
        fakebox_title_score: 1,
      };
      expect(getPollution(video)).to.eq(50);


      video = {
        fakebox_title_decision: 'unsure',
        fakebox_title_score: 0.5,
      };
      expect(getPollution(video)).to.eq(25);
    });
  });

  describe('getProfileResults', () => {
    it('should calculate results correctly', () => {
      const videos = fromJS([
        { temperature: 20, pollution: 10, noise: 0 },
        { temperature: 0, pollution: 0, noise: 0 },
        { temperature: 40, pollution: 20, noise: 0 },
      ]);

      const expected = Map({ temperature: 20, pollution: 10, noise: 0 });
      const result = getProfileResults(videos);
      expect(result).to.be.eq(expected);
    });

    it('should ignore NaN', () => {
      const videos = fromJS([
        { temperature: 'fasd', pollution: 12, noise: 0 },
        { temperature: 0, pollution: 0, noise: 0 },
        { temperature: 30, pollution: 'asd', noise: false },
      ]);

      const expected = Map({ temperature: 10, pollution: 4, noise: 0 });
      const result = getProfileResults(videos);
      expect(result).to.be.eq(expected);
    });
  });

  describe('getRaceResults', () => {
    it('should calculate results correctly', () => {
      const list = fromJS([
        { temperature: 20, pollution: 10, noise: 0 },
        { temperature: 0, pollution: 0, noise: 0 },
        { temperature: 40, pollution: 20, noise: 0 },
      ]);
      const videos = OrderedMap({ 4: list, 5: list });

      const expected = fromJS({
        profiles: [
          { id: 4, temperature: 20, pollution: 10, noise: 0 },
          { id: 5, temperature: 20, pollution: 10, noise: 0 },
        ],
        totals: { temperature: 20, pollution: 10, noise: 0 },
      });
      const result = getRaceResults(videos);
      expect(result).to.be.eq(expected);
    });
  });
});
