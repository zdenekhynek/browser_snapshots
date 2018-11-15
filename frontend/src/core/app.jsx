import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';

import Home from '../home';
import Menu from '../menu';
import Races from '../races';
import Profiles from '../desktop/profiles';
import Results from '../races/results';
import Archive from '../archive';
import Desktop from '../desktop/';
import Ipad from '../ipad/';
import About from '../ipad/about';
import Workout from '../workout';

import {
  createRace,
  getRaces,
  changeActiveRace,
  updateRace,
} from '../races/action_creators';

import noop from '../utils/noop';

import classes from './app.css';

export function App(props, { store }) {
  const { agents, races, activeRace } = props;

  return (
    <div className={classes.app}>
      <Router>
        <div className={classes.inner}>
          <Menu />
          <Profiles />
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
          <Route exact path="/workout" component={Workout} />
          <Route exact path="/workout2" component={Workout} />
          <Route
            exact
            path="/highlights/:raceId"
            render={({ match }) => {
              const { params } = match;
              const { raceId } = params;

              //  display race
              store.dispatch(updateRace(raceId));

              return (<Races raceId={+raceId} />);
            }}
          />

          <Route exact path="/viz/races/:raceId" render={({ match }) => {
            const { params } = match;
            const { raceId } = params;

            //  no ws on this route so request data manually
            store.dispatch(updateRace(+raceId, 1000));

            // let limit = 0;
            // let interval;

            // interval = setInterval(() => {
            //   if (limit < 30) {
            //     limit += 3;
            //   } else {
            //     limit = 0;
            //   }

            //   store.dispatch(updateRace(+raceId, limit));
            // }, 3000);

            return (<Races raceId={+raceId} />);
          }}
          />
          <Route exact path="/viz/races/:raceId/results" render={({ match }) => {
            const { params } = match;
            const { raceId } = params;

            //  no ws on this route so request data manually
            store.dispatch(updateRace(+raceId));

            return (<Races raceId={+raceId} showResults={true} />);
          }}
          />
          <Route exact path="/viz/races/:raceId/summary" render={({ match }) => {
            const { params } = match;
            const { raceId } = params;

            //  no ws on this route so request data manually
            store.dispatch(updateRace(+raceId));

            return (<Results raceId={+raceId} showResults={true} />);
          }}
          />
          <Route exact path="/viz/archive" render={() => {
            store.dispatch(getRaces());
            return (<Archive />);
          }}
          />
          <Route path="/viz/desktop/" component={Desktop} />
          <Route path="/viz/ipad/" component={Ipad} />
        </div>
      </Router>
    </div>
  );
}

App.propTypes = {
  createRace: PropTypes.func,
  changeActiveRace: PropTypes.func,
};

App.defaultProps = {
  createRace: noop,
  changeActiveRace: noop,
};

App.contextTypes = {
  store: PropTypes.object,
};

export default App;
