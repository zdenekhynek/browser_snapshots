import React, { Component, Fragment } from 'react';
import { Route } from 'react-router-dom';
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

class Desktop extends Component {
  constructor(props) {
    super(props);

    //  subscribe to the desktop group
    initSocket(this.onSocketMessage.bind(this));
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
      const finishLink = `/viz/desktop/races/${socketData.id}/results`;
      // history.push(finishLink);
      // this.props.receiveUpdateRace(socketData.id, socketData);
    } else if (message === 'display_highlights') {
      const highlightLink = `/viz/desktop/highlights/`;
      history.push(highlightLink);
    } else if (message === 'display_highlight') {
      const { raceId } = socketData;
      const highlightLink = `/viz/desktop/highlights/${raceId}/`;
      history.push(highlightLink);
      this.props.updateRace(+raceId);
    }
  }

  render() {
    return (
      <Fragment>
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

            return (<Results raceId={+raceId} noAnimation={false} />);
          }}
        />
        <Route exact path="/viz/desktop/highlights/" component={Highlights} />
        <Route
          exact
          path="/viz/desktop/highlights/:raceId"
          render={({ match }) => {
            const { params } = match;
            const { raceId } = params;

            return (<Races raceId={+raceId} />);
          }}
        />
      </Fragment>
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
