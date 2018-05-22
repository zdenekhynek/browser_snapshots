import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { Link } from 'react-router-dom';

import Form from '../races/form';
import { createRace } from '../races/action_creators';

import classes from './home.css';

const Home = (props) => {
  const { agents } = props;

  return (
    <div className={classes.home}>
      <Link className={classes.link} to={'/viz/archive'}>See the archive</Link>
      <Form agents={agents} onSubmit={props.createRace} />
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

Home.propTypes = {};

Home.defaultProps = {};

export default connect(mapStateToProps, { createRace })(Home);
