/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import { List, OrderedMap, Map } from 'immutable';

import {
  calculateProgress,
  calculateRaceProgress,
  reduceUpdateRace,
  reduceCreateRace,
  finishRace,
  NUM_STEPS,
} from './reducer';

describe('Races reducer', () => {
  beforeEach(() => {
    global.AGENTS_LIST = 'development';
  });

  describe('reduceCreateRace', () => {
    it('should have the original agents', () => {
      let result = reduceCreateRace(List());
      //  expect(result.getIn([0, 'tasks'].size)).to.eq(3);
      expect(result.getIn([0, 'tasks', 1])).to.exist;
      expect(result.getIn([0, 'tasks', 7])).to.exist;
      expect(result.getIn([0, 'tasks', 8])).to.exist;

      global.AGENTS_LIST = 'staging';
      result = reduceCreateRace(List());
      expect(result.getIn([0, 'tasks', 4])).to.exist;
      expect(result.getIn([0, 'tasks', 5])).to.exist;
      expect(result.getIn([0, 'tasks', 6])).to.exist;
    });
  });

  describe('reduceUpdateRace', () => {
    it('should reduce races', () => {
      const state = List();
      const raceId = 23;
      const response = {
        created_at: '2018-05-27 00:35:09.873226',
        id: 23,
        keyword: 'fox news',
        message: 'race_update',
        tasks: [],
        type: 'chat_message',
      };
      const races = reduceUpdateRace(state, raceId, response);
      expect(races.size).to.eq(1);
      expect(races.getIn([0, 'id'])).to.equal(23);
    });

    it('should have preserved the agents', () => {
      const raceId = 23;
      const state = reduceCreateRace(List(), raceId);
      const response = {
        created_at: '2018-05-27 00:35:09.873226',
        id: 23,
        keyword: 'fox news',
        message: 'race_update',
        tasks: [
          { id: 4000, agent_id: 7 },
          { id: 4001, agent_id: 1 },
        ],
        type: 'chat_message',
      };
      const races = reduceUpdateRace(state, raceId, response);

      expect(races.size).to.eq(1);
      expect(races.getIn([0, 'tasks', 1])).to.exist;
      expect(races.getIn([0, 'tasks', 7])).to.exist;
      expect(races.getIn([0, 'tasks', 8])).to.exist;
    });

    it('should calculate progress correctly', () => {
      const state = List();
      const raceId = 23;
      const response = {
        created_at: '2018-05-27 00:35:09.873226',
        id: 23,
        keyword: 'fox news',
        message: 'race_update',
        tasks: [
          { agent_id: 4 },
          { agent_id: 4 },
          { agent_id: 2 },
        ],
        type: 'chat_message',
      };
      const races = reduceUpdateRace(state, raceId, response);
      expect(races.size).to.eq(1);
      expect(races.getIn([0, 'progress'])).to.equal(0.1);
    });

    it('should calculate results correctly', () => {
      const state = List();
      const raceId = 23;
      const response = {
        created_at: '2018-05-27 00:35:09.873226',
        id: 23,
        keyword: 'fox news',
        message: 'race_update',
        tasks: [
          { agent_id: 4, temperature: 0, pollution: 10, noise: 0 },
          { agent_id: 4, temperature: 20, pollution: 20, noise: 20 },
          { agent_id: 2, temperature: 0, pollution: 10, noise: 0 },
        ],
        type: 'chat_message',
      };
      const races = reduceUpdateRace(state, raceId, response);
      expect(races.getIn([0, 'results', 'profiles']).size).to.equal(2);
      expect(races.getIn([0, 'results', 'totals', 'temperature'])).to.exist;
    });
  });

  describe('finishRace', () => {
    it('should flip the flag', () => {
      const state = List();
      const raceId = 23;
      const response = {
        created_at: '2018-05-27 00:35:09.873226',
        id: 23,
        keyword: 'fox news',
        message: 'race_update',
        tasks: [
          { agent_id: 4 },
          { agent_id: 4 },
          { agent_id: 2 },
        ],
        type: 'chat_message',
      };
      let races = reduceUpdateRace(state, raceId, response);

      expect(races.getIn([0, 'isFinished'])).to.be.false;
      races = finishRace(races, raceId);

      expect(races.getIn([0, 'isFinished'])).to.be.true;
    });
  });

  describe('calculateProgress', () => {
    it('should calculate progress', () => {
      let tasks = List();
      expect(calculateProgress(tasks)).to.eq(0);

      tasks = List(new Array(4).fill(0));
      expect(calculateProgress(tasks)).to.eq(0.2);

      tasks = List(new Array(NUM_STEPS).fill(0));
      expect(calculateProgress(tasks)).to.eq(1);

      tasks = List(new Array(100).fill(0));
      expect(calculateProgress(tasks)).to.eq(1);

      expect(calculateProgress()).to.eq(0);
    });
  });

  describe('calculateRaceProgress', () => {
    it('should calculate race progress', () => {
      let raceTasks = OrderedMap({
        4: List(new Array(NUM_STEPS).fill(0)),
      });
      expect(calculateRaceProgress(raceTasks)).to.eq(1);

      raceTasks = OrderedMap({
        4: List(new Array(4).fill(0)),
        5: List(new Array(5).fill(0)),
      });
      expect(calculateRaceProgress(raceTasks)).to.eq(0.25);

      raceTasks = OrderedMap({
        4: List(new Array(10).fill(0)),
        5: List(new Array(5).fill(0)),
        6: List(new Array(15).fill(0)),
      });
      expect(calculateRaceProgress(raceTasks)).to.eq(0.75);
    });
  });
});
