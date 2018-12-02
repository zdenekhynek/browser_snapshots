import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Map } from 'immutable';

import Form from '../races/form';
import Background from '../core/background';
import { createRace } from '../races/action_creators';

import classes from './profiles.css';
import profileClasses from './profile.css';

import donaldImage from '../assets/images/donald.png';
import donaldComputerImage from '../assets/images/computer-1.png';
import gwynethImage from '../assets/images/gwyneth.png';
import gwynethComputerImage from '../assets/images/computer-2.png';
import julianImage from '../assets/images/julian.png';
import julianComputerImage from '../assets/images/computer-3.png';

export const PROFILES = [
  {
    email: 'boy.from.queens',
    text: 'Watched in total over 800 hours of Fox News, hamburgers and himself.',
    image: donaldImage,
    computer: donaldComputerImage,
  },
  { 
    email: 'healthy.bunny.guru',
    text: 'Watched in total over 400 hours of MSNBC, Oprah and avocados.',
    image: gwynethImage,
    computer: gwynethComputerImage,
  },
  {
    email: 'transparency.hacker.pirate',
    text: 'Watched in total over 600 hours of NSA, surveillance and... we can\'t tell you',
    image: julianImage,
    computer: julianComputerImage,
  },
];

const renderThumbs = (profileId, thumbId) => {
  const backgroundUrl = pathToSlices(`./${profileId}/image_${thumbId}.jpg`);
  const key = `${profileId}-${thumbId}`;

  return (
    <div key={key} className={classes.thumbs} style={{ backgroundUrl }}>
      <img src={backgroundUrl} className={classes.image} />
    </div>
  )
}

const renderProfile = (index) => {
  const profile = PROFILES[index];
  const { email, text, image, computer } = profile;

  const colors = ['rgb(255, 88, 34)', 'rgb(5, 172, 180)', 'rgb(217, 226, 218)'];
  const color = colors[index];
  const emailStyle = { color };

  //  const borderColor = COLORS[index];
  //  const style = { borderColor };
  
  const backgroundImage = `url(${image})`;
  const imageStyle = { backgroundImage };
  
  const computerImage = `url(${computer})`;
  const computerStyle = { backgroundImage: computerImage };

  return (
    <li className={profileClasses.profileWrapper}>
      <NavLink className={profileClasses.link} to={`./profile/${index}`}>
        <div className={profileClasses.profile}>
          <div className={profileClasses.image} style={imageStyle} />
          <h3 className={profileClasses.email} style={emailStyle}>{email}</h3>
          <div className={profileClasses.computer} style={computerStyle} />
          <h4 className={profileClasses.text}>{text}</h4>
        </div>
      </NavLink>
    </li>
  )
};

const Profiles = (props) => {
  const { agents } = props;

  return (
    <div className={classes.profiles}>
      <h2 className={classes.title}>Meet the profiles</h2>
      <div className={classes.text}>
        <p>
          In May 2018 we created three fake Youtube profiles. We assigned each one a different 
          personality and made them watch hundreds of hours of videos we think they would enjoy.
        </p>
        <p>
          See how they faced off against each other in the <NavLink to="/highlights" className={classes.link}><strong>Best bits</strong></NavLink>.
        </p>
      </div>
      <ul className={classes.list}>
        {PROFILES.map((_, i) => renderProfile(i))}
      </ul>
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

Profiles.propTypes = {};

Profiles.defaultProps = {};

export default connect(mapStateToProps, { createRace })(Profiles);
