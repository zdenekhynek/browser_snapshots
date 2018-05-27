/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import { List, OrderedMap } from 'immutable';

import {
  calculateProgress,
  calculateRaceProgress,
  reduceUpdateRace,
  NUM_STEPS,
} from './reducer';

describe('Races reducer', () => {
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
