import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import moment from 'moment';

import { sendSocketMessage } from '../sockets/socket_service';
import { NUM_STEPS } from '../races/reducer';

import classes from './races.css';

export function renderDot(index, dotsCompleted) {
  const className = (index < dotsCompleted) ?
    classes.finishedProgressDot : classes.progressDot;

  return (
    <span key={index} className={className} />
  );
}

export function renderDots(dotsCompleted, dotsTotal) {
  return (
    <div className={classes.dots}>
      {new Array(dotsTotal).fill(0).map((d, i) => renderDot(i, dotsCompleted))}
    </div>
  );
}

class Races extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const { race } = nextProps;

    if (!prevState.raceFinish) {
      //  projected race finished
      const raceFinish = moment(race.get('created_at')).add(1, 'minutes');

      return {
        now: prevState.now,
        raceFinish,
      };
    }

    return prevState;
  }

  constructor(props) {
    super(props);

    this.state = {
      raceFinish: null,
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        now: moment(),
      });
    }, 1000);
  }

  renderCountDown() {
    const { now, raceFinish } = this.state;
    const duration = moment(raceFinish.diff(now));

    return (
      <div className={classes.countDown}>
        {duration.format('mm:ss')}
      </div>
    );
  }

  render() {
    const { race } = this.props;
    const progress = race.get('progress', 0);

    const steps = Math.ceil(progress * NUM_STEPS);
    const renderedDots = renderDots(steps, NUM_STEPS);
    const renderedCountDown = this.renderCountDown();

    return (
      <div className={classes.races}>
        <h1>Searched for &ldquo;{race.get('keyword')}&rdquo;</h1>
        {renderedCountDown}
        {renderedDots}
        <button
          className={classes.restartBtn}
          onClick={() => {
            sendSocketMessage('restart');
          }}
        >
          Restart
        </button>
      </div>
    );
  };
}

export function mapStateToProps({ agents, metrics, races }, { raceId }) {
  const activeRace = races.find((r) => r.get('id', '') === +raceId, null, Map());

  return {
    race: activeRace,
  };
}

Races.propTypes = {
  className: PropTypes.string,
};

Races.defaultProps = {
  className: '',
};

export default connect(mapStateToProps)(Races);
