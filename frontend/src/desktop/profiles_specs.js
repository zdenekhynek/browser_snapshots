/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import { List, fromJS } from 'immutable';

import {
  getSummary,
  getSummarySentence,
  getProfileMetrics,
} from './profiles';

describe('Profile specs', () => {
  describe('getSummarySentence', () => {
    it('should return value', () => {
      expect(getSummarySentence('pollution', true).title).eq('Toxic avenger');
      expect(getSummarySentence('pollution', true).sentence).eq('Watched videos with high pollution');

      expect(getSummarySentence('temperature', false).title).eq('Weaksauce');
      expect(getSummarySentence('temperature', false).sentence).eq('Watched videos with a low temperature');

      expect(getSummarySentence('non-existing', false).title).eq('');
      expect(getSummarySentence('nontiestsdgn', false).sentence).eq('');

      expect(getSummarySentence('neutral').title).eq('Runner-up');
      expect(getSummarySentence('neutral').sentence).eq('This profile will be reprimanded and will try harder next time');
    });
  });

  describe('getProfileMetrics', () => {
    it('should get min max metrics', () => {
      let profile = fromJS({
        noise: 60, pollution: 45, temperature: 20
      });
      expect(getProfileMetrics(profile)).to.deep.eq(
        { min: 'temperature', max: 'noise' }
      );
      profile = fromJS({
        noise: 0, pollution: 5, temperature: 20
      });
      expect(getProfileMetrics(profile)).to.deep.eq(
        { min: 'noise', max: 'temperature' }
      );
      profile = fromJS({
        pollution: 5, temperature: 20
      });
      expect(getProfileMetrics(profile)).to.deep.eq(
        { min: 'pollution', max: 'temperature' }
      );
    });
  });

  describe('getSummary', () => {
    it('should pick the highest', () => {
      let profiles = fromJS([
        { noise: 60, pollution: 45, temperature: 29 },
        { noise: 0, pollution: 45, temperature: 27 },
        { noise: 0, pollution: 25, temperature: 30 },
      ]);

      let summary = getSummary(profiles);
      expect(summary.getIn([0, 'title'])).to.eq('Where’s the party at?');
      expect(summary.getIn([2, 'title'])).to.eq('Spicemaster');

      profiles = fromJS([
        { noise: 60, pollution: 45, temperature: 29 },
        { noise: 0, pollution: 21, temperature: 27 },
        { noise: 0, pollution: 25, temperature: 26 },
      ]);

      summary = getSummary(profiles);
      expect(summary.getIn([0, 'title'])).to.eq('Where’s the party at?');
      expect(summary.getIn([1, 'title'])).to.eq('Spicemaster');
      expect(summary.getIn([2, 'title'])).to.eq('Where’s my slippers?');
    });
  });
});

// {"gmail" => null}
// {"id" => 1}
// {"name" => "Slavoj Krizala"}
// {"noise" => 45.514304406653174}
// {"pollution" => 0}
// {"temperature" => 19.822085603837735}
