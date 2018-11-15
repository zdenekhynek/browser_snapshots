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
    return <div />;

    const email = EMAILS[index].replace('@gmail.com', '');
    const color = COLORS[index];
    const style = { color };

    return (
      <div>
        <h4 className={classes.email} style={style}>{email}</h4>
      </div>
    )
  }

  renderSummary(index, data) {
    const color = COLORS[index];
    const style = { color };
    const email = EMAILS[index].replace('@gmail.com', '');

    return (
      <div className={classes.summary} style={style}>
        <div className={classes.summaryEmail}>{email}</div>
        <div className={classes.summaryTitle}>{data.get('title')}</div>
        <div className={classes.summarySentence}>{data.get('sentence')}</div>
      </div>
    );
  }

  renderChart(index, data) {
    const { mode, size } = this.props;
    const { height } = size;
    const { isNewRace, shouldAnimateRace } = this.state;

    let className = classes.chart;

    let transitionDuration = '1s';

    // if (mode === 'race' && !shouldAnimateRace) {
    //   offset = height / 2;
    // } else if ((mode === 'race' && shouldAnimateRace) || mode === 'results') {
    //   transitionDuration = '60s';
    //   offset = -(height / 2 - 130);
    // }

    let offsetX = 0;
    let offsetY = 0;

    if (mode === 'race') {
      offsetY = -(height / 2 - 350);
    } else if (mode === 'results' || mode ==='highlights-detail') {
      offsetX = -160;
      offsetY = -(height / 2 - 160);
    } else if (mode === 'summary') {
      offsetY = -50;
    } else if (mode === 'about' || mode === 'highlights') {
       offsetY = -(height / 2 - 160);
    }

    const transform = `translate(${offsetX}px, ${offsetY}px)`;
    const style = { transitionDuration, transform };

    const renderedRadialChart = (mode === 'landing' || mode === 'summary') ?
      renderRadialChart(index) : <span />;
    const chartAnimationKey = (mode === 'landing') ? 'chart' : 'no-chart';

    const renderedEmail = (mode === 'landing') ?
      this.renderEmail(index) : <span />;
    const emailAnimationKey = (mode === 'summary') ? 'email' : 'no-email';

    const shouldRenderSummary = (mode === 'results' || mode ==='highlights-detail')
    const renderedSummary = (shouldRenderSummary) ?
      this.renderSummary(index, data) : <span />;

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
            <TransitionGroup className={classes.summaryTransition}>
                <CSSTransition
                    key={shouldRenderSummary}
                    classNames={{
                     enter: desktopClasses.exampleEnter,
                     enterActive: desktopClasses.exampleEnterActive,
                     exit: desktopClasses.exampleLeave,
                     exitActive: desktopClasses.exampleLeaveActive,
                    }}
                    className={classes.summary}
                    timeout={450}
                >
                  {renderedSummary}
                </CSSTransition>
            </TransitionGroup>
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
    const { mode, results } = this.props;
    const { isNewRace } = this.state;

    //  do not render on ipad
    if (mode === 'ipad') {
      return null;
    }

    const arr = Array(3).fill().map(() => 0);
    const rendredCharts = arr.map((d, i) => {
      const data = (results && results.has(i)) ? results.get(i) : Map();
      return this.renderChart(i, data);
    });

    return (
      <div className={classes.profiles}>
        <div className={classes.charts}>
          {rendredCharts}
        </div>
      </div>
    );
  }
}

export const SENTENCES = {
  temperature: {
    highest: {
      title: 'Spicemaster',
      sentence: 'Watched videos with a high temperature',
    },
    lowest: {
      title: 'Weaksauce',
      sentence: 'Watched videos with a low temperature',
    },
  },
  noise: {
    highest: {
      title: 'Where’s the party at?',
      sentence: 'Watched videos with a high noise level',
    },
    lowest: {
      title: 'Where’s my slippers?',
      sentence: 'Watched videos with a low noise level',
    },
  },
  pollution: {
    highest: {
      title: 'Toxic avenger',
      sentence: 'Watched videos with high pollution',
    },
    lowest: {
      title: 'Clean living',
      sentence: 'Watched videos with low pollution',
    },
  },
  neutral: {
    title: 'Runner-up',
    sentence: 'This profile will try harder next time',
  },
}

export function getSummarySentence(metric, isHighest = false) {
  const highestKey = (isHighest) ? 'highest' : 'lowest';

  if (metric !== 'neutral') {
    if (SENTENCES[metric] && SENTENCES[metric][highestKey]) {
      return SENTENCES[metric][highestKey]
    }
  } else {
    return SENTENCES['neutral'];
  }

  return { title: '', sentence: '' };
}

export function getProfileMetrics(profile) {
  let min = Infinity;
  let max = -Infinity;
  let minProp = '';
  let maxProp = '';

  const keys = ['noise', 'pollution', 'temperature'];

  keys.forEach((key) => {
    const value = profile.get(key, NaN);

    if (!isNaN(value)) {
      if (value < min) {
        min = value;
        minProp = key;
      }
      if (value > max) {
        max = value;
        maxProp = key;
      }
    }
  });

  return { min: minProp, max: maxProp };
}

export function getSummary(profiles) {
  // sort profiles by metrics

  //  get all the numbers for profiles
  const minMax = profiles.map(getProfileMetrics);

  //  go through profile and check whether the min and max are
  //  taken already
  const cache = {};
  const profileMetrics = minMax.map((m) => {
    //  try getting max
    const maxKey = `max-${m.max}`;

    //  can we use max key?
    if (!cache[maxKey]) {
      cache[maxKey] = true;
      return Map({ metric: m.max, isHighest: true});
    }

    //  can we use min key?
    //  try getting min
    const minKey = `min-${m.min}`;

    //  can we use max key?
    if (!cache[minKey]) {
      cache[minKey] = true;
      return Map({ metric: m.min, isHighest: false});
    }

    //  just use neutral
    return Map({ metric :'neutral' });
  });

  return profiles.map((profile, i) => {
    const minMax = (profileMetrics.has(i)) ? profileMetrics.get(i) : Map();

    const summary = getSummarySentence(
      minMax.get('metric'),
      minMax.get('isHighest')
    );

    return profile
      .set('title', summary.title)
      .set('sentence', summary.sentence);
  });
}

export function mapStateToProps(state, ownProps) {
  const { races, agents } = state;
  const { location } = ownProps;
  const { pathname } = location;

  //  get active race id
  let raceIdFromPath = -1;
  const pathnameArr = pathname.split('/');

  console.log('pathnameArr', pathnameArr);

  if (pathnameArr.length > 3) {
    raceIdFromPath = +pathnameArr[pathnameArr.length - 2];
  }

  const activeRace = races.find((r) => r.get('id') === raceIdFromPath, null, Map());
  const raceId = activeRace.get('id', '');
  const results = activeRace.get('results', Map());

  const profilesWithResults = results.get('profiles', List()).map((profile) => {
    const id = profile.get('id');
    const agent = agents
      .get('available')
      .find((a) => a.get('id') === id, null, Map());

    return profile.merge(agent);
  });

  const profilesWithSentence = getSummary(profilesWithResults);

  //  one of the mode: 'ipad', 'landing', 'race', 'results'
  let mode = 'race';

  if (pathname.indexOf('ipad') > -1) {
    mode = 'ipad';
  } else if (pathname.indexOf('desktop/landing') > -1) {
    mode = 'landing';
  } else if (pathname.indexOf('results') > -1) {
    mode = 'results';
  } else if (pathname.indexOf('highlights') > -1) {
    if (raceIdFromPath) {
      mode = 'highlights-detail';
    } else {
      mode = 'highlights';
    }
  } else if (pathname.indexOf('summary') > -1) {
    mode = 'summary';
  }

  if (pathnameArr[1] === 'about') {
    mode = 'about';
  } else if (pathnameArr[1] === '') {
    mode = 'landing';
  } else if (pathnameArr[1] === 'highlights') {
    mode = 'highlights';
  } else if (pathnameArr[1] === 'workout') {
    mode = 'workout';
  }  

  return {
    mode,
    raceId,
    results: profilesWithSentence,
  };
}

Profiles.propTypes = {};

Profiles.defaultProps = {};

// Create the config
const config = { monitorHeight: true, monitorWidth: true };

// Call SizeMe with the config to get back the HOC.
const sizeMeHOC = sizeMe(config);

export default withRouter(connect(mapStateToProps)(sizeMeHOC(Profiles)));
