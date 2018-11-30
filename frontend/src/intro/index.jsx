import React, { Component } from 'react';

import Overlay from './overlay';
import Background from './background';

import classes from './intro.css';

class Intro extends Component {
	constructor(props) {
		super(props);
	
		this.state = { progress: 0 };

		this.onProgressUpdate = this.onProgressUpdate.bind(this);
	}

	onProgressUpdate(progress) {
		this.setState({ progress });
	}

	render() {
		const { progress } = this.state;

		return (
			<div className={classes.intro}>
				<Background progress={progress} />
				<Overlay onProgressUpdate={this.onProgressUpdate} />
			</div>
		);
	}
}

export default Intro;