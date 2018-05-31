import React from 'react';
import PropTypes from 'prop-types';

import RaceChart from './race_chart';

const Races = ({ className, raceId }) => {
  return (
    <div>
      <RaceChart raceId={raceId} />
    </div>
  );
};

Races.propTypes = {
  className: PropTypes.string,
};

Races.defaultProps = {
  className: '',
};

export default Races;
