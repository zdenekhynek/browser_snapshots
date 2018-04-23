import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';

import Form from '../races/form';
import Selector from '../races/selector';
import Tasks from '../races/tasks';
import { createRace, changeActiveRace } from '../races/action_creators';

import noop from '../utils/noop';

export function App(props) {
  const { agents, races, activeRace } = props;

  return (
    <div>
      <Form agents={agents} onSubmit={props.createRace} />
      <Selector races={races} onChange={props.changeActiveRace} />
      <div>
        <Tasks tasks={activeRace.get('tasks', List())} />
      </div>
    </div>
  );
}

//  <span>{races.get('status')}</span>
//  <Tasks tasks={races.get('tasks')} />

export function mapStateToProps({ agents, races }) {
  const activeRace = races.find((r) => r.get('isActive', false), null, Map());

  console.log('mapStateToProps', races);
  console.log('activeRace', activeRace);

  return {
    agents: agents.get('available'),
    races,
    activeRace,
  };
}

App.propTypes = {
  agents: PropTypes.object,
  races: PropTypes.object,
  activeRace: PropTypes.object,
  createRace: PropTypes.func,
  changeActiveRace: PropTypes.func,
};

App.defaultProps = {
  agents: List(),
  races: List(),
  activeRace: Map(),
  createRace: noop,
  changeActiveRace: noop,
};

export default connect(mapStateToProps, { createRace, changeActiveRace })(App);
