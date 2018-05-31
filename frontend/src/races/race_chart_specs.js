/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import { List, fromJS } from 'immutable';

import { mapStateToProps } from './race_chart';

function getRace() {
  return fromJS({
    id: 189,
    active: true,
    keyword: 'test',
    progress: 0,
    tasks: List(),
  });
}

describe('Races chart specs', () => {
  describe('mapStateToProps', () => {
    it('should return something', () => {
      const agents = fromJS([]);
      const races = fromJS([getRace()]);
      const ownProps = { raceId: 12 };
      const state = { agents, races };

      const result = mapStateToProps(state, ownProps);
      expect(result.agents).to.exist;
    });
  });
});
