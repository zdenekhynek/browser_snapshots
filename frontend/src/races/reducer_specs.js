/* global describe, it */
/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import { List } from 'immutable';

import { reduceUpdateRace } from './reducer';

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
  });
});
