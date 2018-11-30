import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { sendSocketMessage } from '../sockets/socket_service';

import Background from '../core/background';

import landingClasses from './landing.css';
import backButtonClasses from '../races/back_button.css';
import classes from './about.css';

const About = ({ className }) => {
  return (
    <div className={classes.about}>
      <div className={classes.content}>
        <h2 className={classes.title}>What next?</h2>
        <p>
          You can let us know what you think at @OutragedM on Twitter.
        </p>
        <p>
          This project has been made by Anna Dziubinska, Paul Button, Pierro Zagami and Zdenek Hynek. 
        </p>
      </div>
    </div>
  );
};

About.propTypes = {
  className: PropTypes.string,
};

About.defaultProps = {
  className: '',
};

export default About;
