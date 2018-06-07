/* global AGENTS_LIST */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import { Link } from 'react-router-dom';

import { AGENTS } from '../races/form';
import { createRace } from '../races/action_creators';
import { sendSocketMessage } from '../sockets/socket_service';

import classes from './landing.css';

export const KEYWORDS = [
  'Fox News', 'surveillance', 'london knife crime', 'president trump',
  'crimea bridge', 'leave.eu', 'boris johnson', 'greenfell tower',
];

export function getRandomKeyword() {
  const randomIndex = Math.floor(Math.random() * KEYWORDS.length);
  return KEYWORDS[randomIndex];
}

class Landing extends Component {
  constructor(props) {
    super(props);

    const list = AGENTS[AGENTS_LIST].map((a) => a.id);
    this.state = {
      mode: 'random',
      keyword: '',
      currentAgents: list,
      submitted: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onHighlightLink = this.onHighlightLink.bind(this);
  }

  onSubmit(keyword) {
    const { currentAgents } = this.state;
    this.props.createRace(keyword, currentAgents);
    sendSocketMessage('session_start');
    this.setState({ submitted: true });
  }

  onHighlightLink(evt) {
    const keyword = getRandomKeyword();
    this.onSubmit(keyword);
  }

  render() {
    const { agents } = this.props;

    //  make sure when submitted that users cannot click again
    const { submitted } = this.state;
    if (submitted) {
      return null;
    }

    return (
      <div className={classes.landing}>
        <div>
          <h1 className={classes.title}>
            Watch what YouTube serves to our three volunteers
          </h1>
          <h2 className={classes.subtitle}>
            Over the last month, they’ve consumed hundreds hours of content
          relevant to their interests.
          </h2>
        </div>
        <div>
          <button
            className={classes.highlightLink}
            onClick={this.onHighlightLink}
          >
            Let’s watch
          </button>
          <Link
            className={classes.link}
            to={'/viz/ipad/topics/'}
            onClick={() => {
              sendSocketMessage('display_topics');
            }}
          >
            Choose a topic
          </Link>
          <Link
            className={classes.link}
            to={'/viz/ipad/highlights/'}
            onClick={() => {
              sendSocketMessage('display_highlights');
            }}
          >
            See the highlights
          </Link>
        </div>
        <div>
          <Link
            className={classes.textLink}
            to={'/viz/ipad/about/'}
            onClick={() => {
              sendSocketMessage('display_about');
            }}
          >
            What is this?
          </Link>
        </div>
      </div>
    );
  }
}

export function mapStateToProps({ agents, races }) {
  const activeRace = races.find((r) => r.get('isActive', false), null, Map());

  return {
    agents: agents.get('available'),
    races,
    activeRace,
  };
}

Landing.propTypes = {
  className: PropTypes.string,
};

Landing.defaultProps = {
  className: '',
};

export default connect(mapStateToProps, { createRace })(Landing);
