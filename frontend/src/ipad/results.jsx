import React from 'react';
import PropTypes from 'prop-types';

import { sendSocketMessage } from '../sockets/socket_service';

import classes from './results.css';

const Results = ({ className }) => {
  return (
    <div className={classes.ipadResults}>
      <h1>Ready for another round?</h1>
      <button
        className={classes.btn}
        onClick={() => {
          sendSocketMessage('restart');
        }}
      >
        Yes, please!
      </button>
    </div>
  );
};

Results.propTypes = {
  className: PropTypes.string,
};

Results.defaultProps = {
  className: '',
};

export default Results;
