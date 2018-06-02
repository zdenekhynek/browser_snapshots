import React, { Component } from 'react';
import PropTypes from 'prop-types';
import sizeMe from 'react-sizeme';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Map } from 'immutable'

import Profile from './profile';
import RadialChart from '../races/radial_chart';

import classes from './profiles.css';

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

  renderChart(index) {
    const { mode, size } = this.props;
    const { height } = size;
    const { isNewRace, shouldAnimateRace } = this.state;

    let className = classes.chart;

    let transitionDuration = '1s';
    let offset = 0;

    if (mode === 'race' && !shouldAnimateRace) {
      offset = height / 2;
    } else if ((mode === 'race' && shouldAnimateRace) || mode === 'results') {
      transitionDuration = '60s';
      offset = -(height / 2 - 130);
    }

    const transform = `translate(0, ${offset}px)`;
    const style = { transitionDuration, transform };

    const renderedRadialChart = (mode !== 'race') ?
      renderRadialChart(index) : null;

    return (
      <div key={index} className={classes.col}>
        <div className={classes.chart} style={style}>
          <div className={classes.profile}>
            <Profile index={index} />
          </div>
          {renderedRadialChart}
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

  //  one of the mode: 'ipad', 'landing', 'race', 'results'
  let mode = 'race';

  if (pathname.indexOf('ipad') > -1) {
    mode = 'ipad';
  } else if (pathname.indexOf('desktop/landing') > -1) {
    mode = 'landing';
  } else if (pathname.indexOf('results') > -1) {
    mode = 'results';
  }

  return { mode, raceId };
}

Profiles.propTypes = {};

Profiles.defaultProps = {};

// Create the config
const config = { monitorHeight: true, monitorWidth: true };

// Call SizeMe with the config to get back the HOC.
const sizeMeHOC = sizeMe(config);

export default withRouter(connect(mapStateToProps)(sizeMeHOC(Profiles)));
