import React from 'react';
import PropTypes from 'prop-types';

import RaceChart from './race_chart';

const Races = ({ className, raceId, noAnimation, showResults = false }) => {
  return (
    <RaceChart
      raceId={raceId}
      noAnimation={noAnimation}
      showResults={showResults}
    />
  );
};

Races.propTypes = {
  className: PropTypes.string,
};

Races.defaultProps = {
  className: '',
};

export default Races;
