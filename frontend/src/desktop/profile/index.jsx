import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import COLORS from '../../races/colors';

import classes from './profile.css';
import donaldImage from '../../assets/images/donald.png';
import gwynethImage from '../../assets/images/gwyneth.png';
import julianImage from '../../assets/images/julian.png';

export const IMAGES = [donaldImage, gwynethImage, julianImage];

const Profile = ({ index }) => {
  const image = IMAGES[index];
  const borderColor = COLORS[index];
  const backgroundImage = `url(${image})`;
  const style = { borderColor };
  const imageStyle = { backgroundImage };

  return (
    <NavLink to={`/profile/${index}`} className={classes.profile} style={style}>
      <div className={classes.image} style={imageStyle} />
    </NavLink>
  );
};

Profile.propTypes = {
  className: PropTypes.string,
};

Profile.defaultProps = {
  className: '',
};

export default Profile;
