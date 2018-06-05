import React, { Component } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import sizeMe from 'react-sizeme';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Map, List } from 'immutable'

import Profile from './profile';
import RadialChart from '../races/radial_chart';
import COLORS from '../races/colors';

import classes from './profiles.css';
import desktopClasses from './desktop.css';

export const EMAILS = [
  'boy.from.queens@gmail.com',
  'healthy.bunny.guru@gmail.com',
  'transparency.hacker.pirate@gmail.com',
];

export function renderRadialChart(index) {
  return (
    <div key={index} className={classes.radialChart}>
      <RadialChart index={index} />
    </div>
  );
}

class Profiles extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    //  find out if we need to translate
    const isNewRace = (
      nextProps.mode === 'race' &&
      prevState.raceId !== nextProps.raceId
    );

    return {
      raceId: nextProps.raceId,
      isNewRace,
    };
  }

  constructor(props) {
    super(props);

    this.state = { raceId: false, isNewRace: false, shouldAnimateRace: false };
  }

  renderTotals() {
    return (
      <span>totals</span>
    )
  }

  renderEmail(index) {
    const email = EMAILS[index].replace('@gmail.com', '');
    const color = COLORS[index];
    const style = { color };

    return (
      <div>
        <h4 className={classes.email} style={style}>{email}</h4>
      </div>
    )
  }

  renderChart(index) {
    const { mode, size } = this.props;
    const { height } = size;
    const { isNewRace, shouldAnimateRace } = this.state;

    let className = classes.chart;

    let transitionDuration = '1s';
    let offset = 0;

    // if (mode === 'race' && !shouldAnimateRace) {
    //   offset = height / 2;
    // } else if ((mode === 'race' && shouldAnimateRace) || mode === 'results') {
    //   transitionDuration = '60s';
    //   offset = -(height / 2 - 130);
    // }

    if (mode === 'race' || mode === 'results' || mode === 'highlights') {
      offset = -(height / 2 - 160);
    } else if (mode === 'summary') {
      offset = -50;
    }

    const transform = `translate(0, ${offset}px)`;
    const style = { transitionDuration, transform };

    const renderedRadialChart = (mode === 'landing' || mode === 'summary') ?
      renderRadialChart(index) : <span />;
    const chartAnimationKey = (mode === 'landing') ? 'chart' : 'no-chart';

    const renderedEmail = (mode === 'landing') ?
      this.renderEmail(index) : <span />;
    const emailAnimationKey = (mode === 'summary') ? 'email' : 'no-email';

    return (
      <div key={index} className={classes.col}>
        <div className={classes.chart} style={style}>
          <TransitionGroup className={classes.radialChartTransition}>
            <CSSTransition
                key={emailAnimationKey}
                classNames={{
                 enter: desktopClasses.exampleEnter,
                 enterActive: desktopClasses.exampleEnterActive,
                 exit: desktopClasses.exampleLeave,
                 exitActive: desktopClasses.exampleLeaveActive,
                }}
                className={classes.radialChartTransition}
                timeout={450}
            >
              {renderedEmail}
            </CSSTransition>
          </TransitionGroup>
          <div className={classes.profile}>
            <Profile index={index} />
          </div>
          <TransitionGroup className={classes.radialChartTransition}>
            <CSSTransition
                key={chartAnimationKey}
                classNames={{
                 enter: desktopClasses.exampleEnter,
                 enterActive: desktopClasses.exampleEnterActive,
                 exit: desktopClasses.exampleLeave,
                 exitActive: desktopClasses.exampleLeaveActive,
                }}
                className={classes.radialChartTransition}
                timeout={450}
            >
              {renderedRadialChart}
            </CSSTransition>
          </TransitionGroup>
        </div>
      </div>
    );
  }

  render() {
    const { mode } = this.props;
    const { isNewRace } = this.state;

    //  do not render on ipad
    if (mode === 'ipad') {
      return null;
    }

    if (isNewRace) {
      setTimeout(() => {
        this.setState({ shouldAnimateRace: true });
      }, 1000);
    }

    const arr = Array(3).fill().map(() => 0);
    const rendredCharts = arr.map((d, i) => this.renderChart(i));

    return (
      <div className={classes.profiles}>
        <div className={classes.charts}>
          {rendredCharts}
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const { races } = state;
  const { location } = ownProps;
  const { pathname } = location;

  const activeRace = races.find((r) => r.get('isActive', false), null, Map());
  const raceId = activeRace.get('id', '');
  const results = activeRace.get('results', Map());

  const profilesWithResults = results.get('profiles', List()).map((profile) => {
    const id = profile.get('id');
    const agent = agents
      .get('available')
      .find((a) => a.get('id') === id, null, Map());

    return profile.merge(agent);
  });

  //  one of the mode: 'ipad', 'landing', 'race', 'results'
  let mode = 'race';

  if (pathname.indexOf('ipad') > -1) {
    mode = 'ipad';
  } else if (pathname.indexOf('desktop/landing') > -1) {
    mode = 'landing';
  } else if (pathname.indexOf('results') > -1) {
    mode = 'results';
  } else if (pathname.indexOf('highlights') > -1) {
    mode = 'highlights';
  } else if (pathname.indexOf('summary') > -1) {
    mode = 'summary';
  }

  return {
    mode,
    raceId,
    results: results.set('profiles', profilesWithResults),
  };
}

Profiles.propTypes = {};

Profiles.defaultProps = {};

// Create the config
const config = { monitorHeight: true, monitorWidth: true };

// Call SizeMe with the config to get back the HOC.
const sizeMeHOC = sizeMe(config);

export default withRouter(connect(mapStateToProps)(sizeMeHOC(Profiles)));
