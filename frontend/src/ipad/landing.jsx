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
      customKeyword: '',
      currentAgents: list,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onCustomKeywordSubmit = this.onCustomKeywordSubmit.bind(this);
    this.onCustomKeywordClick = this.onCustomKeywordClick.bind(this);
    this.onHighlightLink = this.onHighlightLink.bind(this);
    this.onBackLink = this.onBackLink.bind(this);
    this.onKeywordsLink = this.onKeywordsLink.bind(this);
    this.onKeyword = this.onKeyword.bind(this);
    this.onKeywordChange = this.onKeywordChange.bind(this);
  }

  onSubmit(keyword) {
    const { currentAgents } = this.state;
    this.props.createRace(keyword, currentAgents);
    sendSocketMessage('session_start');
  }

  onHighlightLink(evt) {
    const keyword = getRandomKeyword();
    this.onSubmit(keyword);
  }

  onKeyword(keyword) {
    this.onSubmit(keyword);
  }

  onKeywordChange(evt) {
    this.setState({ customKeyword: evt.target.value });
  }

  onKeywordsLink() {
    this.setState({ mode: 'keywords' });
  }

  onBackLink() {
    this.setState({ mode: 'random' });
  }

  onCustomKeywordSubmit(evt) {
    evt.preventDefault();
  }

  onCustomKeywordClick() {
    this.onSubmit(this.state.customKeyword);
  }

  renderRandomButton() {
    return (
      <div>
        <button
          className={classes.highlightLink}
          onClick={this.onHighlightLink}
        >
          Measure temperature
        </button>
        <button
          className={classes.link}
          onClick={this.onKeywordsLink}
        >
          Explore keywords
        </button>
      </div>
    );
  }

  renderKeyword(keyword) {
    return (
      <div
        className={classes.keyword}
        onClick={() => {
          this.onKeyword(keyword);
        }}
      >
          {keyword}
      </div>
    );
  }

  renderExploreKeywords() {
    return (
      <div>
        <div className={classes.keywords}>
          {KEYWORDS.map(this.renderKeyword.bind(this))}
        </div>
        <form
          className={classes.form}
          onSubmit={this.onCustomKeywordSubmit}
        >
          <input
            type="text"
            className={classes.input}
            value={this.state.customKeyword}
            onChange={this.onKeywordChange}
            placeholder="Type in keyword"
          />
          <button
            className={classes.link}
            type="submit"
            onClick={this.onCustomKeywordClick}
          >
            Search for yours
          </button>
        </form>
        <button
          className={classes.link}
          onClick={this.onBackLink}
        >
          Back to basics
        </button>
      </div>
    );
  }

  render() {
    const { agents } = this.props;
    const { mode } = this.state;

    const renderedSection = (mode === 'random') ?
      this.renderRandomButton() : this.renderExploreKeywords();

    return (
      <div className={classes.landing}>
        {renderedSection}
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
