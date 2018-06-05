/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import { List, fromJS } from 'immutable';

import { getSummary, getSummarySentence } from './profiles';

describe('Profile specs', () => {
  describe('getSummarySentence', () => {
    it('should return value', () => {
      expect(getSummarySentence('pollution', true).title).eq('Where’s the party at?');
      expect(getSummarySentence('pollution', true).sentence).eq('Watched videos with a high noise level');

      expect(getSummarySentence('temperature', false).title).eq('Clean living');
      expect(getSummarySentence('temperature', false).sentence).eq('Watched videos with low pollution');

      expect(getSummarySentence('non-existing', false).title).eq('');
      expect(getSummarySentence('nontiestsdgn', false).sentence).eq('');
    });
  });

  describe('getSummary', () => {
    it('should pick the highest', () => {
      const profiles = fromJS([
        { noise: 60, pollution: 45, temperature: 29 },
        { noise: 0, pollution: 45, temperature: 29 },
        { noise: 0, pollution: 25, temperature: 30 },
      ]);
    });
  });
});

// {"gmail" => null}
// {"id" => 1}
// {"name" => "Slavoj Krizala"}
// {"noise" => 45.514304406653174}
// {"pollution" => 0}
// {"temperature" => 19.822085603837735}
