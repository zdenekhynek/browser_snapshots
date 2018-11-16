import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import Background from '../core/background';

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
				<Background />
			 	<div className={classes.content}>
					<h2 className={classes.title}>Highlights</h2>
					<div className={classes.content}>
		        <h3 className={classes.subtitle}>
		          During the <a href="http://dataobscura.info/" target="_blank">Data Obscura exhibition</a> in London, we've let
		          visitors to choose a keyword which profiles searched for. To see how different the content recomended by YouTube
		          for each profile will be.
		        </h3>
		      	<h4 className={classes.subtitle}>Here are some more interesting results.</h4>
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