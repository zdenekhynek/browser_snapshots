import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';

import Home from '../home';
import Races from '../races';
import Archive from '../archive';
import Desktop from '../desktop/';
import Ipad from '../ipad/';

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
        <Switch>
          <Route exact path="/viz" component={Home} />
          <Route exact path="/viz/races/:raceId" render={({ match }) => {
            const { params } = match;
            const { raceId } = params;

            //  no ws on this route so request data manually
            store.dispatch(updateRace(+raceId));

            return (<Races raceId={+raceId} />);
          }}
          />
          <Route exact path="/viz/archive" render={() => {
            store.dispatch(getRaces());
            return (<Archive />);
          }}
          />
          <Route path="/viz/desktop/" component={Desktop} />
          <Route path="/viz/ipad/" component={Ipad} />
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
