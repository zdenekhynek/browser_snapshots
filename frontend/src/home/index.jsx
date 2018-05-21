import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import Form from '../races/form';
import { createRace } from '../races/action_creators';

const Home = (props) => {
  const { agents } = props;

  return (
    <h1>
      <Form agents={agents} onSubmit={props.createRace} />
    </h1>
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

Home.propTypes = {};

Home.defaultProps = {};

export default connect(mapStateToProps, { createRace })(Home);
