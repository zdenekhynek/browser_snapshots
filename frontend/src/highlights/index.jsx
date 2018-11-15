import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import classes from './highlights.css';

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

class Highlights extends Component {
	render() {
		return (
			<div className={classes.highlights}>
				<h2 className={classes.title}>Highlights</h2>
				<div className={classes.content}>
	        <h3 className={classes.subtitle}>
	          During an exhbition, we've allowed people to search for a keyword to see how
	          different results profiles will watch. Here's what they saw.
	        </h3>
	        <ul className={classes.links}>
	        {
	          HIGHLIGHTS.map((highlight) => {
	            return (
	              <li><NavLink to={`/highlights/${highlight.id}`}>{highlight.name}</NavLink></li>
	            );
	          })
	        }
	        </ul>
	      </div>
			</div>
		);
	}
}

Highlights.propTypes = {
  className: PropTypes.string,
};

Highlights.defaultProps = {
  className: '',
};

export default Highlights;