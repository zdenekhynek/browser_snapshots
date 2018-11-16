import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { sendSocketMessage } from '../sockets/socket_service';

import Background from '../core/background';

import landingClasses from './landing.css';
import backButtonClasses from '../races/back_button.css';
import classes from './about.css';

const renderBackButton = () => {
  return (
    <div className={classes.backButtonWrapper}>
      <NavLink className={backButtonClasses.backButton} to="/">&lt; Back</NavLink>
    </div>
  );
}

const About = ({ className }) => {
  return (
    <div className={classes.about}>
      <Background />
      <div className={classes.content}>
        <h2 className={classes.title}>What is this?</h2>
        <p>
          Sure. You are a strong individual living in a democratic society. But
          are you really in control of how you spend your time? Especially when
          spending time in digital environments designed to keep you engaged. And outraged.
        </p>
        <p>
          We don't have the answer. What we do have are three gmail profiles which
          we left watching loads of YouTube. So that you don't have to. To find
          out how different the content they'll be exposed to is.
        </p>
        <p>
          At the <a href="http://dataobscura.info/" target="_blank">Data Obscura exhibition</a>, 
          visitors could  watch a live session where the profiles
          ("our volunteers") search for a keyword on YouTube,
          clicking first search result and then clicking "Up next" video
          multiple times.
        </p>
        <p>
           See where they got to. And how different results they are served.
        </p>
        <p>
          You can let us know what you think at @OutragedM on Twitter.
        </p>
        <p>
          This project has been made by Anna Dziubinska, Paul Button, Pierro Zagami and Zdenek Hynek. 
        </p>
      </div>
      {renderBackButton()}
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
