import React from 'react';
import PropTypes from 'prop-types';

import { sendSocketMessage } from '../sockets/socket_service';

import landingClasses from './landing.css';
import classes from './about.css';

const About = ({ className }) => {
  return (
    <div className={classes.about}>
      <div>
        <h2 className={classes.title}>What is this?</h2>
        <p>
          Sure. You are a strong individual living in a democratic society. But
          are you really in control of how you spend your time? Especially when
          spending time in digital environments designed to keep you engaged.
        </p>
        <p>
          We don't have the answer. What we do have are three gmail profiles which
          we left watching loads of YouTube. So that you don't have to. To find
          out how different the content they'll be exposed to is.
        </p>
        <p>
          The three profiles are:
        </p>
        <ul>
          <li>boy.from.queens@gmail.com</li>
          <li>healthy.bunny.guru@gmail.com</li>
          <li>transparency.hacker.pirate@gmail.com</li>
        </ul>
        <p>
          At the exhibition, you can watch a live session where the profiles
          ("our volunteers") search for a keyword on YouTube,
          clicking first search result and then clicking "Up next" video
          multiple times.
        </p>
        <p>
           See where they get to. And how different results they are served.
        </p>
        <p>
          You can let us know what you think at @OutragedM on Twitter or stay
          in touch at outraged.me.
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
