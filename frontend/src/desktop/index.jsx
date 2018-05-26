import React, { Component, Fragment } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import Races from '../races';
import Archive from '../archive';
import Landing from '../landing';
import Results from '../races/results';
import { initSocket } from '../sockets/socket_service';

class Desktop extends Component {
  constructor(props) {
    super(props);

    //  subscribe to the ipad group
    initSocket('desktop', this.onSocketMessage.bind(this));
  }

  onSocketMessage(message) {
    console.log('onSocketMessage', message);
    const { history } = this.props;

    if (message === 'session_start') {
      const racesLink = '/viz/desktop/races/';
      history.push(racesLink);
    } else if (message === 'restart') {
      const landingLink = '/viz/desktop/landing/';
      history.push(landingLink);
    }
  }

  render() {
    return (
      <Fragment>
        <Route exact path="/viz/desktop/landing" component={Landing} />
        <Route exact path="/viz/desktop/races/:raceId" component={Races} />
        <Route exact path="/viz/desktop/races/:raceId/results" component={Results} />
      </Fragment>
    );
  }
}

Desktop.propTypes = {
  className: PropTypes.string,
};

Desktop.defaultProps = {
  className: '',
}

export default withRouter(Desktop);
