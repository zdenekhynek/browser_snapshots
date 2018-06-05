import React from 'react';
import PropTypes from 'prop-types';

import classes from './metrics.css';

const Metrics = ({ className }) => {
  return (
    <div className={classes.metrics}>
      <div className={classes.metric}>
        <div>
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
        <div>
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
        <div>
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
