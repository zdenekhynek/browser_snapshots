import React from 'react';
import PropTypes from 'prop-types';

import noiseSvg from './noise.png';
import pollutionSvg from './pollution.png';
import temperatureSvg from './temperature.png';

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
        <p>
          How engaging the video is.
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
        <p>
          How much is video likely to be fake news.
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
        <p>
          How outrageous the video is.
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
