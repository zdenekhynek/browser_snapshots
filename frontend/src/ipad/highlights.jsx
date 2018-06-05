import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { List } from 'immutable';

import { sendSocketMessage } from '../sockets/socket_service';
import Metrics from './metrics';

import classes from './highlights.css';
import landingClasses from './landing.css';

export function renderList(races) {
  return (
    <ul>
      {
        races.map((race, i) => {
          const raceId = race.get('id');
          const link = `/viz/ipad/highlights/${raceId}`;

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
                sendSocketMessage('display_highlight', { raceId });
              }}
            >
              {label}
            </Link>
          </li>);
        })
      }
    </ul>
  );
}

export function renderBackToStart() {
  return (
    <a
      className={landingClasses.link}
      onClick={() => {
        sendSocketMessage('restart');
      }}
    >
        Back to start
    </a>
  );
}

export function renderBackToList() {
  const link = '/viz/ipad/highlights/';

  return (
    <Link
      to={link}
      className={landingClasses.link}
    >
        Back to list
    </Link>
  );
}

export const Highlights = ({ races, showMetrics = false }) => {
  const latestRaces = races.reverse();
  const renderedList = (!showMetrics) ?
    renderList(latestRaces) : null;
  const renderedMetrics = (showMetrics) ?
    <Metrics /> : null;
  const renderButton = (showMetrics) ?
    renderBackToList() : renderBackToStart();

  const className = (!showMetrics) ?
    classes.highlights : classes.highlightsBlack;

  return (
    <div className={className}>
      <div>
        <h1 className={landingClasses.title}>Highlights</h1>
        {renderedList}
      </div>
      {renderedMetrics}
      <div>
        {renderButton}
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
