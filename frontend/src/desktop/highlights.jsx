import React from 'react';
import PropTypes from 'prop-types';

import classes from './highlights.css';

const Highlights = (props) => {
  return (
    <div className={classes.highlights}>
      <h1>Select a highlight on the ipad</h1>
    </div>
  );
};

Highlights.propTypes = {
  className: PropTypes.string,
};

Highlights.defaultProps = {
  className: '',
};

export default Highlights;
