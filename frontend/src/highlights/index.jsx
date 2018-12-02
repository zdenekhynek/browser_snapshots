import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import classes from './highlights.css';

export const HIGHLIGHTS = [
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

const thumbImageReq = require.context('../assets/images/thumbs/');

export const renderLink = (highlight) => {
	const thumbId = `./${highlight.id}-thumb.jpg`;
	const imageUrl = thumbImageReq(thumbId);

	return (
		<li>
			<NavLink to={`/highlights/${highlight.id}`} className={classes.link}>
				<img src={imageUrl} className={classes.thumbImage} />
				<span className={classes.thumbName}>{highlight.name}</span>
			</NavLink>
		</li>
	);
};

class Highlights extends Component {
	render() {
		return (
			<div className={classes.highlights}>
				<div className={classes.highlightsCol}>
					<h2 className={classes.title}>Best bits</h2>
					<div>
						<p>
							During the <a href="http://dataobscura.info/" target="_blank">Data Obscura exhibition</a> in London, we've let
		          visitors to choose a keyword which profiles searched for. To see how different the content recomended by YouTube
		          for each profile will be.
		        </p>
		      	<p>
		      		We wanted to demonstrate how each profile is served up different content 
		      		based on their historical viewing habits - reinforcing their existing tastes 
		      		in a filter bubble.
		      	</p>
		      	<p>
		      		We also wanted to see if content started to get more and more ‘extreme’ with each video 
		      		served up. This would confirm our suspicions that viewers are 
		      		being channelled into more outrageous content to keep engagement 
		      		as high as possible.
		      	</p>
		      	<p>
		      		Here are some of the more interesting results.
		      	</p>
		      </div>
				</div>
				<div className={classes.highlightsCol}>
	        <ul className={classes.links}>
		        {HIGHLIGHTS.map(renderLink)}
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