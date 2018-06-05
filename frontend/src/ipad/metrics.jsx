import React from 'react';
import PropTypes from 'prop-types';

import noiseSvg from './icon_noise.png';
import pollutionSvg from './icon_pollution.png';
import temperatureSvg from './icon_temperature.png';

import classes from './metrics.css';

export function renderIcon(icon) {
  return (
    <span className={classes.icon}>
      <img src={icon} className={classes.svg} />
    </span>
  );
}

const Metrics = ({ className }) => {

  const noiseIcon = renderIcon(noiseSvg);
  const pollutionIcon = renderIcon(pollutionSvg);
  const temperatureIcon = renderIcon(temperatureSvg);

  return (
    <div className={classes.metrics}>
      <div className={classes.metric}>
        <div className={classes.metricWrapper}>
          {noiseIcon}
          <h5 className={classes.metricTitle}>Noise</h5>
        </div>
        <p className={classes.metricDescription}>
          The level of engagement
          <span className={classes.metricValue}>
            number of interactions / number of views
          </span>
        </p>
      </div>
      <div className={classes.metric}>
        <div className={classes.metricWrapper}>
          {pollutionIcon}
          <h5 className={classes.metricTitle}>Pollution</h5>
        </div>
        <p className={classes.metricDescription}>
          The level of likelihood being a fake news
          <span className={classes.metricValue}>
            Powered by FakeBox.
          </span>
        </p>
      </div>
      <div className={classes.metric}>
        <div className={classes.metricWrapper}>
          {temperatureIcon}
          <h5 className={classes.metricTitle}>Temperature</h5>
        </div>
        <p className={classes.metricDescription}>
          The level of outrage
          <span className={classes.metricValue}>
            Proportion between likes and dislikes
          </span>
        </p>
      </div>
    </div>
  );
};

Metrics.propTypes = {
  className: PropTypes.string,
};

Metrics.defaultProps = {
  className: '',
};

export default Metrics;
