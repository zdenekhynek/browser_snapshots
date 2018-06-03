import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { List } from 'immutable';

import { sendSocketMessage } from '../sockets/socket_service';

import classes from './highlights.css';
import landingClasses from './landing.css';

const Highlights = ({ races }) => {
  const latestRaces = races.reverse();

  return (
    <div className={classes.highlights}>
      <div>
        <h1 className={landingClasses.title}>Highlights</h1>
        <ul>
          {
            latestRaces.map((race, i) => {
              const raceId = race.get('id');
              const link = `/viz/races/${raceId}`;

              const raceKeyword = race.get('keyword');

              const date = new Date(race.get('created_at'));
              const raceDate = (raceId > -1) ?
                `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}` : '';

              let label = race.get('label');

              if (raceId > -1) {
                label = (race.get('description')) ?
                  race.get('description', '') : 'Race';
              }

              return (<li key={i}>
                <Link
                  to={link}
                  onClick={(evt) => {
                    evt.preventDefault();
                    sendSocketMessage('display_highlight', { raceId });
                  }}
                >
                  {label}
                </Link>
              </li>);
            })
          }
        </ul>
      </div>
      <div>
        <a
          className={landingClasses.link}
          onClick={() => {
            sendSocketMessage('restart');
          }}
        >
            Back
        </a>
      </div>
    </div>
  );
};

export function mapStateToProps({ races }) {
  //  get only certain races
  const highlightedRaces = races.filter(
    (r) => r.get('is_highlighted', false),
    null,
    List()
  );

  return {
    races: highlightedRaces,
  };
}

Highlights.propTypes = {
  className: PropTypes.string,
};

Highlights.defaultProps = {
  className: '',
};

export default connect(mapStateToProps)(Highlights);
