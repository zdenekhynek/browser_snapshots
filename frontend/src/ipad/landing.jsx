import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { Link } from 'react-router-dom';

import Form from '../races/form';
import { createRace } from '../races/action_creators';
import { sendSocketMessage } from '../sockets/socket_service';

import classes from './landing.css';

const Landing = (props) => {
  const { agents } = props;

  return (
    <div className={classes.landing}>
      <Link className={classes.link} to={'/viz/archive'}>See the archive</Link>
      <Form
        agents={agents}
        onSubmit={(keyword, agentIds) => {
          props.createRace(keyword, agentIds);
          sendSocketMessage('session_start');
        }}
      />
    </div>
  );
};

export function mapStateToProps({ agents, races }) {
  const activeRace = races.find((r) => r.get('isActive', false), null, Map());

  return {
    agents: agents.get('available'),
    races,
    activeRace,
  };
}

Landing.propTypes = {
  className: PropTypes.string,
};

Landing.defaultProps = {
  className: '',
};

export default connect(mapStateToProps, { createRace })(Landing);
