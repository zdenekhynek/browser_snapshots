import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';

import Home from '../home';
import Races from '../races';
import Form from '../races/form';
import Selector from '../races/selector';

import {
  createRace,
  getRaces,
  changeActiveRace,
} from '../races/action_creators';

import noop from '../utils/noop';

import classes from './app.css';

export function App(props, { store }) {
  const { agents, races, activeRace } = props;

  return (
    <div className={classes.app}>
      <Router>
        <Switch>
          <Route exact path="/viz" render={({ match }) => {
            store.dispatch(getRaces());

            return <Home />;
          }}
          />
          <Route exact path="/viz/races/:raceId" render={({ match }) => {
            const { params } = match;
            const { raceId } = params;

            //  make sure we have data for route
            store.dispatch(getRaces());

            setTimeout(() => {
              store.dispatch(changeActiveRace(+raceId));
            }, 1000);

            return (<Races raceId={raceId} />);
          }}
          />
        </Switch>
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
