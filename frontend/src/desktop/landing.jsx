import React from 'react';
import PropTypes from 'prop-types';

import Profile from '../races/profile';
import RadialChart from '../races/radial_chart';

import classes from './landing.css';

export function renderChart(d, index) {
  return (
    <div className={classes.col}>
      <div className={classes.chart}>
        <div className={classes.profile}>
          <Profile index={index} />
        </div>
        <div className={classes.radialChart}>
          <RadialChart index={index} />
        </div>
      </div>
    </div>
  );
}

const Landing = (props) => {
  const arr = Array(3).fill().map(() => 0);
  const rendredCharts = arr.map(renderChart);

  return (
    <div className={classes.landing}>
      <div className={classes.charts}>
        {rendredCharts}
      </div>
    </div>
  );
};

Landing.propTypes = {
  className: PropTypes.string,
};

Landing.defaultProps = {
  className: '',
};

export default Landing;
