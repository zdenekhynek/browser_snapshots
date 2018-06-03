/* global AGENTS_LIST */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import { Link } from 'react-router-dom';

import { AGENTS } from '../races/form';
import { createRace } from '../races/action_creators';
import { sendSocketMessage } from '../sockets/socket_service';

import icon from './search_icon.svg';
import classes from './landing.css';

export const KEYWORDS = [
  'Fox News', 'surveillance', 'london knife crime', 'president trump',
  'crimea bridge', 'leave.eu', 'boris johnson', 'greenfell tower',
  'irish referendum', "let's take back control",
];

export function getRandomKeyword() {
  const randomIndex = Math.floor(Math.random() * KEYWORDS.length);
  return KEYWORDS[randomIndex];
}

class KeywordSelection extends Component {
  constructor(props) {
    super(props);

    const list = AGENTS[AGENTS_LIST].map((a) => a.id);
    this.state = {
      keyword: '',
      customKeyword: '',
      currentAgents: list,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onCustomKeywordSubmit = this.onCustomKeywordSubmit.bind(this);
    this.onCustomKeywordClick = this.onCustomKeywordClick.bind(this);
    this.onBackLink = this.onBackLink.bind(this);
    this.onKeyword = this.onKeyword.bind(this);
    this.onKeywordChange = this.onKeywordChange.bind(this);
  }

  onSubmit(keyword) {
    const { currentAgents } = this.state;
    this.props.createRace(keyword, currentAgents);
    sendSocketMessage('session_start');
  }

  onKeyword(keyword) {
    this.onSubmit(keyword);
  }

  onKeywordChange(evt) {
    this.setState({ customKeyword: evt.target.value });
  }

  onBackLink() {
    sendSocketMessage('restart');
  }

  onCustomKeywordSubmit(evt) {
    evt.preventDefault();
  }

  onCustomKeywordClick() {
    this.onSubmit(this.state.customKeyword);
  }

  renderKeyword(keyword) {
    return (
      <div
        key={keyword}
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
      <div className={classes.formWrapper}>
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
            placeholder="Or type in your own keyword ..."
          />
          <button
            className={classes.iconLink}
            type="submit"
            onClick={this.onCustomKeywordClick}
          >
            <img
              className={classes.icon}
              src={icon}
            />
          </button>
        </form>

      </div>
    );
  }

  render() {
    const { agents } = this.props;
    const { mode } = this.state;

    const renderedSection = this.renderExploreKeywords();

    return (
      <div className={classes.landing}>
        <h1 className={classes.keywordTitle}>
          Select a keyword you want our volunteers to search for
        </h1>
        {renderedSection}
        <button
          className={classes.link}
          onClick={this.onBackLink}
        >
          Back
        </button>
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

KeywordSelection.propTypes = {
  className: PropTypes.string,
};

KeywordSelection.defaultProps = {
  className: '',
};

export default connect(mapStateToProps, { createRace })(KeywordSelection);
