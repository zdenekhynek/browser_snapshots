import React from 'react';
import PropTypes from 'prop-types';

import { sendSocketMessage } from '../sockets/socket_service';

const Races = ({ className }) => {
  return (
    <div>
      <h1>Ipad Races page</h1>
      <button onClick={() => {
        sendSocketMessage('restart');
      }}>
        Restart
      </button>
    </div>
  );
};

Races.propTypes = {
  className: PropTypes.string,
};

Races.defaultProps = {
  className: '',
};

export default Races;
