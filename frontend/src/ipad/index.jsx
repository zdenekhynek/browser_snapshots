import React, { Component, Fragment } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import IpadLanding from './landing';
import IpadRaces from './races';
import IpadResults from './results';
import IpadHighlights from './highlights';
import { initSocket } from '../sockets/socket_service';

class Ipad extends Component {
  constructor(props) {
    super(props);

    //  subscribe to the ipad group
    initSocket('ipad', this.onSocketMessage.bind(this));
  }

  onSocketMessage(message) {
    const { history } = this.props;

    if (message === 'session_start') {
      const racesLink = '/viz/ipad/races/';
      history.push(racesLink);
    } else if (message === 'restart') {
      const landingLink = '/viz/ipad/landing/';
      history.push(landingLink);
    }
  }

  render() {
    return (
      <Fragment>
        <Route exact path="/viz/ipad/landing" component={IpadLanding} />
        <Route exact path="/viz/ipad/races/" component={IpadRaces} />
        <Route exact path="/viz/ipad/races/:raceId" component={IpadRaces} />
        <Route exact path="/viz/ipad/races/:raceId/results" component={IpadResults} />
        <Route exact path="/viz/ipad/highlights" component={IpadHighlights} />
      </Fragment>
    );
  }
}

Ipad.propTypes = {
  className: PropTypes.string,
};

Ipad.defaultProps = {
  className: '',
};

export default withRouter(Ipad);
