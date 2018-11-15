import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import classes from './menu.css';

class Menu extends Component {
	render() {
		return (
			<ul className={classes.menu}>
				<li>
					<NavLink to="/" className={classes.link}
						activeClassName={classes.activeLink}>
						Intro
					</NavLink>
				</li>
				<li>
					<NavLink to="/workout" className={classes.link}
						activeClassName={classes.activeLink}>
						Your Workout
					</NavLink>
				</li>
				<li>
					<NavLink to="/about" className={classes.link}
						activeClassName={classes.activeLink}>
						About
					</NavLink>
				</li>
			</ul>
		)
	}
}

Menu.propTypes = {
  className: PropTypes.string,
};

Menu.defaultProps = {
  className: '',
};

export default Menu;