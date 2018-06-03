import React from 'react';
import PropTypes from 'prop-types';

import { sendSocketMessage } from '../sockets/socket_service';

import landingClasses from './landing.css';
import classes from './about.css';

const About = ({ className }) => {
  return (
    <div className={classes.about}>
      <div>
        <h1 className={classes.title}>What is this?</h1>
        <p>
          We've created three gmail profiles and let them watch different
          videos on YouTube while logged-in to their accounts.
        </p>
        <p>
          The three profiles are:
          <ul>
            <li>boy.from.queens@gmail.com</li>
            <li>healthy.bunny.guru@gmail.com</li>
            <li>transparency.hacker.pirate@gmail.com</li>
          </ul>
        </p>
        <p>
          One live session is profiles searching for a keyword on YouTube,
          clicking first search result and then clicking "Up next" video
          multiple times.
        </p>
      </div>
      <button
        className={landingClasses.link}
        onClick={() => {
          sendSocketMessage('restart');
        }}
      >
        Back
      </button>
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
