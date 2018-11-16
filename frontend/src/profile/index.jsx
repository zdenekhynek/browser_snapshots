import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Map } from 'immutable';

import Form from '../races/form';
import { createRace } from '../races/action_creators';
import { EMAILS } from '../desktop/profiles';

import classes from './profile.css';
import backButtonClasses from '../races/back_button.css';

const INTERESTS = [
  'Watched in total over 800 hours of Fox News, hamburgers and himself.',
  'Watched in total over 400 hours of MSNBC, Oprah and avocados.',
  'Watched in total over 600 hours of NSA, surveillance and... we can\'t tell you',
];

const pathToSlices = require.context('../assets/images/slices', true);

const renderBackButton = () => {
  return (
    <div className={classes.backButtonWrapper}>
      <NavLink className={backButtonClasses.backButton} to="/">&lt; Back</NavLink>
    </div>
  );
}

const renderTitle = (index) => {
  const colors = ['rgb(255, 88, 34)', 'rgb(5, 172, 180)', 'rgb(217, 226, 218)'];
  const color = colors[index];

  return (
    <div className={classes.titleWrapper} style={{ color }}>
      <h2>{EMAILS[index]}</h2>
      <h3>{INTERESTS[index]}</h3>
      <h4>These are all the videos it has seen: </h4>
    </div>
  );
};

const renderThumbs = (profileId, thumbId) => {
  const backgroundUrl = pathToSlices(`./${profileId}/image_${thumbId}.jpg`);
  const key = `${profileId}-${thumbId}`;

  return (
    <div key={key} className={classes.thumbs} style={{ backgroundUrl }}>
      <img src={backgroundUrl} className={classes.image} />
    </div>
  )
}

const Profile = (props) => {
  const { profileId } = props;

  let numThumbs = 81;
  if (profileId === 1) {
    numThumbs = 71;
  } else if (profileId === 2) {
    numThumbs = 75;
  }

  const thumbs = new Array(numThumbs).fill(0);

  return (
    <div className={classes.profile}>
      {renderTitle(profileId)}
      <div className={classes.thumbsWrapper}>
        {thumbs.map((_, i) => renderThumbs(profileId, i))}
      </div>
       {renderBackButton()}
    </div>
  );
};

export function mapStateToProps({ agents, races }) {
  const activeRace = races.find((r) => r.get('isActive', false), null, Map());

  return {
    agents: agents.get('available'),
    races,
    activeRace,
  };
}

Profile.propTypes = {};

Profile.defaultProps = {};

export default connect(mapStateToProps, { createRace })(Profile);
