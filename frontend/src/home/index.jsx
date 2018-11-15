import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import Form from '../races/form';
import { createRace } from '../races/action_creators';

import classes from './home.css';


const renderTitle = () => {
  return (
    <div className={classes.titleWrapper}>
      <h2>In May 2018, we had three fake profiles watch hundreds of hours of YouTube.</h2>
    </div>
  );
};

const Home = (props) => {
  const { agents } = props;

  return (
    <div className={classes.home}>
      {renderTitle()}
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
