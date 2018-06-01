import React from 'react';
import PropTypes from 'prop-types';

import classes from './profile.css';

import donaldImage from '../../assets/images/donald.png';
import gwynethImage from '../../assets/images/gwyneth.png';
import julianImage from '../../assets/images/julian.png';

export const IMAGES = [donaldImage, gwynethImage, julianImage];

const Profile = ({ color, index }) => {
  const image = IMAGES[index];
  const borderColor = color;
  const backgroundImage = `url(${image})`;
  const style = { borderColor };
  const imageStyle = { backgroundImage };

  return (
    <div className={classes.profile} style={style}>
      <div className={classes.image} style={imageStyle} />
    </div>
  );
};

Profile.propTypes = {
  className: PropTypes.string,
};

Profile.defaultProps = {
  className: '',
};

export default Profile;