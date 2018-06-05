import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import { sendSocketMessage } from '../sockets/socket_service';
import Metrics from './metrics';

import classes from './results.css';
import landingClasses from './landing.css';

//  5 minute timeout interval
export const TIMEOUT = 5 * 60 * 1000;

export class Results extends Component {
  constructor(props) {
    super(props);

    this.state = { mode: 'summary' };

    this.onRestartClick = this.onRestartClick.bind(this);
    this.onSessionClick = this.onSessionClick.bind(this);
    this.onSummaryClick = this.onSummaryClick.bind(this);

    this.restartTimeout = null;
  }

  componentDidMount() {
    this.restartTimeout = setTimeout(() => {
      this.onRestartClick();
    }, TIMEOUT);
  }

  componentDidUnmount() {
    clearTimeout(restartTimeout);
  }

  onRestartClick() {
    sendSocketMessage('restart');
  }

  onSessionClick() {
    sendSocketMessage('display_race_results');
    this.setState({ mode: 'results' });
  }

  onSummaryClick() {
    sendSocketMessage('display_race_summary');
    this.setState({ mode: 'summary' });
  }

  renderBackToSummary() {
    return (
      <button
        className={landingClasses.link}
        onClick={this.onSummaryClick}
      >
        Back to summary
      </button>
    )
  }

  renderBackToResults() {
    return (
      <button
        className={landingClasses.link}
        onClick={this.onSessionClick}
      >
        Back to session
      </button>
    );
  }

  render() {
    const { race } = this.props;
    const { mode } = this.state;

    const keyword = (race && race.get('keyword'))?
      race.get('keyword') : 'something';
    const label = `Try searching for "${keyword}" on your YouTube.`;

    const renderedBtn = (mode === 'summary') ?
      this.renderBackToResults() : this.renderBackToSummary();
    const renderedMetrics = (mode === 'results') ?
      <Metrics /> : <span />;

    return (
      <div className={classes.ipadResults}>
        <div>
          <h1 className={landingClasses.title}>
            {label}
          </h1>
          <h2 className={classes.subtitle}>
            To find out, who you are.
          </h2>
        </div>
        <div className={classes.metrics}>
          {renderedMetrics}
        </div>
        <div>
          {renderedBtn}
          <button
            className={landingClasses.link}
            onClick={this.onRestartClick}
          >
            Start over
          </button>
        </div>
      </div>
    );
  }
}

Results.propTypes = {
  className: PropTypes.string,
};

Results.defaultProps = {
  className: '',
};


export function mapStateToProps({ agents, metrics, races }, { raceId }) {
  const activeRace = races.find((r) => r.get('id', '') === +raceId, null, Map());

  return {
    race: activeRace,
  };
}

Results.propTypes = {};

Results.defaultProps = {};

export default connect(mapStateToProps)(Results);
