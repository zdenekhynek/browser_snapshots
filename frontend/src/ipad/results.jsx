import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import { sendSocketMessage } from '../sockets/socket_service';

import classes from './results.css';
import landingClasses from './landing.css';

const Results = ({ race }) => {
  const keyword = (race && race.get('keyword'))?
    race.get('keyword') : 'something';
  const label = `Try searching for "${keyword}" on your YouTube.`;

  return (
    <div className={classes.ipadResults}>
      <div>
        <h1 className={landingClasses.title}>
          {label}
        </h1>
        <h2>
          To find out, what’s next up for you.
        </h2>
      </div>
      <button
        className={landingClasses.link}
        onClick={() => {
          sendSocketMessage('restart');
        }}
      >
        Start over
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


export function mapStateToProps({ agents, metrics, races }, { raceId }) {
  const activeRace = races.find((r) => r.get('id', '') === +raceId, null, Map());

  return {
    race: activeRace,
  };
}

Results.propTypes = {};

Results.defaultProps = {};

export default connect(mapStateToProps)(Results);
