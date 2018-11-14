import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Workout extends Component {
	render() {
		return (
			<div>Workout</div>
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