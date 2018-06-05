import React from 'react';
import PropTypes from 'prop-types';

import COLORS from '../races/colors';

import classes from './landing.css';


export const MESSAGE = [
  'Watched in total over 800 hours of Fox News, hamburgers and himself.',
  'Watched in total over 400 hours of MSNBC, Oprah and avocados.',
  "Watched in total over 600 hours of NSA, surveillance and... we can't tell you.",
];

export function renderProfile(index) {
  const color = COLORS[index];
  const message = MESSAGE[index];
  const style = { color };

  return (
    <div className={classes.profileCol} style={style}>
      <div className={classes.profileWrapper}>
        <div>
          <h4 className={classes.totalContent}>
            {message}
          </h4>
        </div>
      </div>
    </div>
  );
}

const Landing = (props) => {
  return (
    <div className={classes.landing}>
      {renderProfile(0)}
      {renderProfile(1)}
      {renderProfile(2)}
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
