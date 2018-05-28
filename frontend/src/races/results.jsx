import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';

export function renderLine(r, k) {
  return (<li key={k}>{k}: {r}</li>);
}

export function displayResults(title, results) {
  return (
    <div key={title}>
      <h3>{title}</h3>
      <ul>
        {results.toSeq().map(renderLine)}
      </ul>
    </div>
  );
}

const Results = ({ keyword, results }) => {
  console.log('results', results);

  const totalResults = displayResults('totals', results.get('totals', Map()));
  const profileResults = results.get('profiles', Map()).map((r) => {
    const title = `Profile: ${r.get('id')}`;
    return displayResults(title, r.delete('id'));
  });

  return (
    <div>
      <h1>Results</h1>
      {totalResults}
      <div>
        {profileResults}
      </div>
      <h2>
        Why don&apos;t you try searching for &ldquo;{keyword}&rdquo;
        on your YouTube.
      </h2>
    </div>
  );
};

export function mapStateToProps({ agents, metrics, races }, { raceId }) {
  const activeRace = races.find((r) => r.get('id', '') === +raceId, null, Map());
  const results = activeRace.get('results', Map());

  console.log('activeRace', activeRace, races, raceId);

  return {
    keyword: activeRace.get('keyword'),
    results,
  };
}

Results.propTypes = {
  className: PropTypes.string,
};

Results.defaultProps = {
  className: '',
};

export default connect(mapStateToProps)(Results);
