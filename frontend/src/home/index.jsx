import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { NavLink } from 'react-router-dom';

import Form from '../races/form';
import { createRace } from '../races/action_creators';

import classes from './home.css';

const HIGHLIGHTS = [
  { id: 613, name: 'The one with no gluten and no moon' },
  { id: 576, name: 'The one with the annexation, reptilians and the Queen of England' },
  { id: 317, name: 'The naughty one' },
  { id: 101, name: 'The one with the royal wedding, Iran and Jordan Peterson' },
  { id: 299, name: 'The one with Howard Stern and Piers Morgan' },
  { id: 291, name: 'The one with AUDI and the spider' },
  { id: 266, name: 'The one with improving the vocabulary' },
  { id: 264, name: 'The one with the toxic parents and flat earth' },
  { id: 262, name: 'The one with the pyramides and the bayes theorem' },
  { id: 252, name: 'The one with the ice-cream and NSA' },
  { id: 237, name: 'The one with Donald, Edward and Vladimir' },
  { id: 225, name: 'The one with the monkey. And the other monkey' },
  { id: 202, name: 'The one with the Judge Jeanine, Obama and AR-15' },
];

const Home = (props) => {
  const { agents } = props;

  return (
    <div className={classes.home}>
      <div className={classes.links}>
        {
          HIGHLIGHTS.map((highlight) => {
            return (
              <NavLink to={`/highlights/${highlight.id}`}>{highlight.name}</NavLink>
            );
          })
        }
      </div>
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
