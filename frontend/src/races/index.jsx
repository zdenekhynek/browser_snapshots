import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RaceChart from './race_chart';
import Tasks from './tasks';

const Races = ({ className, raceId }) => {
  return (
    <div>
      <RaceChart raceId={raceId} />
      <Tasks raceId={raceId} />
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
