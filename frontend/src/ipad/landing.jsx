import React from 'react';
import PropTypes from 'prop-types';

import { sendSocketMessage } from '../sockets/socket_service';

const Landing = ({ className }) => {
  return (
    <div>
      <h1>Ipad Landing page</h1>
      <button onClick={() => {
        sendSocketMessage('session_start');
      }}>
        Start session
      </button>
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
