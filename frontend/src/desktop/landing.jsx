import React from 'react';
import PropTypes from 'prop-types';

import classes from './landing.css';

const Landing = (props) => {
  return (
    <div className={classes.landing}>
      Landing
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
