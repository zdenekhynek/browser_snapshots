import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';

import Form from '../races/form';
import Tasks from '../races/tasks';
import { createRace } from '../races/action_creators';

import noop from '../utils/noop';

export function App(props) {
  const { agents, races } = props;

  return (
    <div>
      <Form agents={agents} onSubmit={props.createRace} />
      <span>{races.get('status')}</span>
      <Tasks tasks={races.get('tasks')} />
    </div>
  );
}

export function mapStateToProps({ agents, races }) {
  return {
    agents: agents.get('available'),
    races,
  };
}

App.propTypes = {
  agents: PropTypes.object,
  races: PropTypes.object,
  createRace: PropTypes.func,
};

App.defaultProps = {
  agents: List(),
  races: Map(),
  createRace: noop,
};

export default connect(mapStateToProps, { createRace })(App);
