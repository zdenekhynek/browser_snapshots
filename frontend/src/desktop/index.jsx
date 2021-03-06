import React, { Component, Fragment } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import Races from '../races';
import Landing from './landing';
import Highlights from './highlights';
import Results from '../races/results';
import { initSocket } from '../sockets/socket_service';
import {
  receiveCreateRace,
  receiveUpdateRace,
  updateRace,
} from '../races/action_creators';

import classes from './desktop.css';

class Desktop extends Component {
  constructor(props) {
    super(props);

    //  subscribe to the desktop group
    initSocket(this.onSocketMessage.bind(this));

    this.lastSocketId = null;
  }

  onSocketMessage(socketData) {
    const { history } = this.props;
    const { message } = socketData;

    if (message === 'session_start') {
      const racesLink = '/viz/desktop/races/';
      history.push(racesLink);
    } else if (message === 'restart') {
      const landingLink = '/viz/desktop/landing/';
      history.push(landingLink);
    } else if (message === 'race_started') {
      const raceLink = `/viz/desktop/races/${socketData.id}`;
      history.push(raceLink);
      this.props.receiveCreateRace(socketData);
    } else if (message === 'race_update') {
      this.props.receiveUpdateRace(socketData.id, socketData);
    } else if (message === 'race_finished') {
      const resultsLink = `/viz/desktop/races/${socketData.id}/results`;
      history.push(resultsLink);
      this.props.receiveUpdateRace(socketData.id, socketData);
    //else if (message === 'display_race_results') {
    //   //  display race results
    //   const resultsLink = `/viz/desktop/races/${this.lastSocketId}/results`;
    //   history.push(resultsLink);
    // } else if (message === 'display_race_summary') {
    //   //  display race summary
    //   const summaryLink = `/viz/desktop/races/${this.lastSocketId}/summary`;
    //   history.push(summaryLink);
    } else if (message === 'display_highlight') {
      const { raceId } = socketData;
      const highlightLink = `/viz/desktop/highlights/${raceId}/`;
      history.push(highlightLink);
      this.props.updateRace(+raceId);
    }

    if (socketData.id) {
      this.lastSocketId = socketData.id;
    }
  }

  render() {
    const { location } = this.props;

    return (
      <div className={classes.desktop}>
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
              <Route exact path="/viz/desktop/landing" component={Landing} />
              <Route
                exact
                path="/viz/desktop/races/:raceId"
                render={({ match }) => {
                  const { params } = match;
                  const { raceId } = params;

                  return (<Races raceId={+raceId} noAnimation={false} />);
                }}
              />
              <Route
                exact
                path="/viz/desktop/races/:raceId/results"
                render={({ match }) => {
                  const { params } = match;
                  const { raceId } = params;

                  return (<Races raceId={+raceId} showResults={true} />);
                }}
              />
              <Route
                exact
                path="/viz/desktop/races/:raceId/summary"
                render={({ match }) => {
                  const { params } = match;
                  const { raceId } = params;

                  return (<Results raceId={+raceId} />);
                }}
              />
              <Route
                exact
                path="/viz/desktop/highlights/"
                component={Highlights}
              />
              <Route
                exact
                path="/viz/desktop/highlights/:raceId"
                render={({ match }) => {
                  const { params } = match;
                  const { raceId } = params;

                  return (<Races raceId={+raceId} showResults={true}/>);
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

Desktop.propTypes = {
  className: PropTypes.string,
};

Desktop.defaultProps = {
  className: '',
};

export default connect(
  mapStateToProps,
  { receiveCreateRace, receiveUpdateRace, updateRace }
)(withRouter(Desktop));
