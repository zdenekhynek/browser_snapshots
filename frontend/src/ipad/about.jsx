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
        <h2 className={classes.title}>Do try this at home</h2>
        <p>And now is your turn. Go to youtube.com and see what the algorithm serves you. Here are some fun exercises you can try:</p>
        <ul className={classes.list}>
          <li>Can you get to a video about "chemtrails" if you search for "climate change"? Take your time.</li>
          <li>Are you able to get to a Russia Today video if you search for "immigration in Europe"?</li>
          <li>Look at your recommended videos. Look at them really well. Do you think you are and intersting person
          who is fun to be around?</li>
        </ul>
        <p>
          Let us know your results at @OutragedM on Twitter.
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
