import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { NavLink } from 'react-router-dom';

import Form from '../races/form';
import { createRace } from '../races/action_creators';

import classes from './home.css';

const Home = (props) => {
  const { agents } = props;

  return (
    <div className={classes.home}>
      <NavLink to="/highlights/613">Highlight 613</NavLink>
      <NavLink to="/highlights/576">Highlight 576</NavLink>
      <NavLink to="/highlights/2">Highlight 4</NavLink>
      <NavLink to="/highlights/2">Highlight 5</NavLink>
      <NavLink to="/highlights/2">Highlight 6</NavLink>
      <NavLink to="/highlights/2">Highlight 7</NavLink>
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
