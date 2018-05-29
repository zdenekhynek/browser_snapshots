import React from 'react';
import PropTypes from 'prop-types';

import { sendSocketMessage } from '../sockets/socket_service';

const Results = ({ className }) => {
  return (
    <div>
      <h1>Ipad Results page</h1>
      <button
        onClick={() => {
          sendSocketMessage('restart');
        }}
      >
        Restart
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
