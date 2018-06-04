import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';
import { format } from 'd3-format';

import COLORS from './colors';

import classes from './results.css';

export const formatter = format(',.2f');

export function renderLine(k, r) {
  return (
    <li
      className={classes.item}
      key={k}
    >
      <div className={classes.innerItem}>
        <h4 className={classes.lineTitle}>{k}</h4>
        <span>{formatter(r)}</span>
      </div>
    </li>
  );
}

export function displayResults(title, results, index) {
  const color = COLORS[index];
  const style = { color };

  return (
    <div className={classes.profileCol} style={style}>
      <div className={classes.profileWrapper}>
        <div key={title} className={classes.raceTable}>
          <h3 className={classes.tableTitle}>{title}</h3>
          <ul className={classes.list}>
            {renderLine('temperature', results.get('temperature'))}
            {renderLine('noise', results.get('noise'))}
            {renderLine('pollution', results.get('pollution'))}
          </ul>
        </div>
        <div>
          <h4 className={classes.totalContent}>
            Watched 23,000 hours of content over the last month.
          </h4>
        </div>
      </div>
    </div>
  );
}

const Results = ({ keyword, results }) => {
  const totalResults = displayResults('Totals', results.get('totals', Map()));
  const profileResults = results.get('profiles', Map()).map((r, i) => {
    return displayResults(r.get('gmail'), r.delete('id'), i);
  });

  const formattedKeyword = (keyword) ?
    `"${keyword}"` : 'something';

  /*<div className={classes.prompt}>
    <h2>
      Why don&apos;t you try searching for {formattedKeyword} on your YouTube?
    </h2>
  </div>


  <div className={classes.totalResults}>
    {totalResults}
  </div>*/

  return (
    <div className={classes.results}>
      <div className={classes.profileResults}>
        {profileResults}
      </div>
    </div>
  );
};

export function mapStateToProps({ agents, metrics, races }, { raceId }) {
  const activeRace = races.find((r) => r.get('id', '') === +raceId, null, Map());
  const results = activeRace.get('results', Map());

  const profilesWithResults = results.get('profiles', List()).map((profile) => {
    const id = profile.get('id');
    const agent = agents
      .get('available')
      .find((a) => a.get('id') === id, null, Map());

    return profile.merge(agent);
  });

  return {
    keyword: activeRace.get('keyword'),
    results: results.set('profiles', profilesWithResults),
  };
}

Results.propTypes = {
  className: PropTypes.string,
};

Results.defaultProps = {
  className: '',
};

export default connect(mapStateToProps)(Results);
