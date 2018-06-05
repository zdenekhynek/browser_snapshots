import React, { Component, Fragment } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import IpadLanding from './landing';
import IpadTopics from './keyword_selection';
import IpadAbout from './about';
import IpadRaces from './races';
import IpadResults from './results';
import IpadHighlights from './highlights';
import { initSocket } from '../sockets/socket_service';
import {
  getRaces,
  receiveCreateRace,
  receiveUpdateRace,
} from '../races/action_creators';

import classes from './ipad.css';

class Ipad extends Component {
  constructor(props) {
    super(props);

    //  subscribe to the ipad group
    initSocket(this.onSocketMessage.bind(this));
  }

  onSocketMessage(socketData) {
    const { history } = this.props;
    const { message } = socketData;

    if (message === 'session_start') {
      // const racesLink = '/viz/ipad/races/';
      // history.push(racesLink);
    } else if (message === 'restart') {
      const landingLink = '/viz/ipad/landing/';
      history.push(landingLink);
    } else if (message === 'display_topics') {
      // const topicsLink = '/viz/ipad/topics/';
      // history.push(topicsLink);
    } else if (message === 'display_about') {
      // const aboutLink = '/viz/ipad/about/';
      // history.push(aboutLink);
    } else if (message === 'race_started') {
      const raceLink = `/viz/ipad/races/${socketData.id}`;
      history.push(raceLink);
      this.props.receiveCreateRace(socketData);
    } else if (message === 'race_update') {
      this.props.receiveUpdateRace(socketData.id, socketData);
    } else if (message === 'race_finished') {
      const finishLink = `/viz/ipad/races/${socketData.id}/summary`;
      history.push(finishLink);
      this.props.receiveUpdateRace(socketData.id, socketData);
    }
  }

  render() {
    const { location } = this.props;

    return (
      <div className={classes.ipad}>
        <div className={classes.header}>
          <h1 className={classes.title}>Engaged and Outraged</h1>
        </div>
        <TransitionGroup>
          <CSSTransition
            key={location.key}
            classNames={{
             enter: classes.exampleEnter,
             enterActive: classes.exampleEnterActive,
             exit: classes.exampleLeave,
             exitActive: classes.exampleLeaveActive,
            }}
            timeout={450}
          >
            <Switch location={location}>
              <Route exact path="/viz/ipad/landing" component={IpadLanding} />
              <Route exact path="/viz/ipad/topics" component={IpadTopics} />
              <Route exact path="/viz/ipad/about" component={IpadAbout} />
              <Route exact path="/viz/ipad/races" component={IpadRaces} />
              <Route
                exact
                path="/viz/ipad/races/:raceId"
                render={({ match }) => {
                  const { params } = match;
                  const { raceId } = params;

                  return (<IpadRaces raceId={+raceId} />);
                }}
              />
              <Route
                exact
                path="/viz/ipad/races/:raceId/summary"
                render={({ match }) => {
                  const { params } = match;
                  const { raceId } = params;

                  return (<IpadResults raceId={+raceId} />);
                }}
              />
              <Route
                exact
                path="/viz/ipad/highlights"
                render={({ match }) => {
                  this.props.getRaces(true);
                  return (<IpadHighlights />);
                }}
              />
              <Route
                exact
                path="/viz/ipad/highlights/:raceId"
                render={({ match }) => {
                  return (<IpadHighlights showMetrics={true} />);
                }}
              />
            </Switch>
          </CSSTransition>
        </TransitionGroup>
      </div>
    );
  }
}

export function mapStateToProps({ agents, metrics, races }) {
  return {};
}

Ipad.propTypes = {
  className: PropTypes.string,
};

Ipad.defaultProps = {
  className: '',
};

export default connect(
  mapStateToProps,
  { getRaces, receiveCreateRace, receiveUpdateRace }
)(withRouter(Ipad));
