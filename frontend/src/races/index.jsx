import React from 'react';
import PropTypes from 'prop-types';

import RaceChart from './race_chart';

const Races = ({ className, raceId, noAnimation }) => {
  return (
    <RaceChart raceId={raceId} noAnimation={noAnimation} />
  );
};

Races.propTypes = {
  className: PropTypes.string,
};

Races.defaultProps = {
  className: '',
};

export default Races;
