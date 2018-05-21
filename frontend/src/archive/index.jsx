import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import classes from './archive.css';

const Archive = ({ races }) => {
  const latestRaces = races.reverse();

  return (
    <div className={classes.archive}>
      <h2>Archive</h2>
      <ul>
        {
          latestRaces.map((race) => {
            const raceId = race.get('id');
            const link = `/viz/races/${raceId}`;

            const raceKeyword = race.get('keyword');

            const date = new Date(race.get('created_at'));
            const raceDate = (raceId > -1) ?
              `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}` : '';

            const label = (raceId > -1) ?
              `Searched for ${raceKeyword}` : race.get('label');

            return (<li>
              <Link to={link}>
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

Archive.propTypes = {
  className: PropTypes.string,
};

Archive.defaultProps = {
  className: '',
};

export default connect(mapStateToProps)(Archive);
