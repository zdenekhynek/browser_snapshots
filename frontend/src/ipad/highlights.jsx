import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { sendSocketMessage } from '../sockets/socket_service';

import classes from './highlights.css';

const Highlights = ({ races }) => {
  const latestRaces = races.reverse();

  return (
    <div className={classes.highlights}>
      <a
        onClick={() => {
          sendSocketMessage('restart');
        }}
      >
          Start new session
      </a>
      <h2>Highlights</h2>
      <ul>
        {
          latestRaces.map((race, i) => {
            const raceId = race.get('id');
            const link = `/viz/races/${raceId}`;

            const raceKeyword = race.get('keyword');

            const date = new Date(race.get('created_at'));
            const raceDate = (raceId > -1) ?
              `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}` : '';

            const label = (raceId > -1) ?
              `Searched for ${raceKeyword}` : race.get('label');

            return (<li key={i}>
              <Link
                to={link}
                onClick={(evt) => {
                  evt.preventDefault();
                  sendSocketMessage('display_highlight', { raceId });
                }}
              >
                <span className={classes.date}>{raceDate}:</span> {label}
              </Link>
            </li>);
          })
        }
      </ul>
    </div>
  );
};

export function mapStateToProps({ races }) {
  return {
    races,
  };
}

Highlights.propTypes = {
  className: PropTypes.string,
};

Highlights.defaultProps = {
  className: '',
};

export default connect(mapStateToProps)(Highlights);
