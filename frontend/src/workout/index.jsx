import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classes from './workout.css';

class Workout extends Component {
	render() {
		return (
			<div className={classes.workout}>
				<h2 className={classes.title}>Your Youtube Workout</h2>
			</div>
		);
	}
}

Workout.propTypes = {
  className: PropTypes.string,
};

Workout.defaultProps = {
  className: '',
};

export default Workout;