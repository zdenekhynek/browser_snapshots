import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import classes from './menu.css';

class Menu extends Component {
	render() {
		return (
			<div className={classes.menuWrapper}>
				<h1 className={classes.logo}>Engaged <span>&</span> <strong>Outraged</strong></h1>
				<ul className={classes.menu}>
					<li>
						<NavLink to="/profiles" className={classes.link}
							activeClassName={classes.activeLink}>
							Meet the profiles
						</NavLink>
					</li>
					<li>
						<NavLink to="/highlights" className={classes.link}
							activeClassName={classes.activeLink}>
							Best bits
						</NavLink>
					</li>
					<li>
						<NavLink to="/about" className={classes.link}
							activeClassName={classes.activeLink}>
							What next?
						</NavLink>
					</li>
				</ul>
			</div>
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