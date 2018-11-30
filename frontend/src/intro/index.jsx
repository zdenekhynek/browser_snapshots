import React, { Component } from 'react';
import { withRouter } from "react-router";

import Overlay from './overlay';
import Background from './background';

import classes from './intro.css';

class Intro extends Component {
	constructor(props) {
		super(props);
	
		this.state = { progress: 0 };

		this.onProgressUpdate = this.onProgressUpdate.bind(this);
		this.onCloseClick = this.onCloseClick.bind(this);
	}

	onProgressUpdate(progress) {
		this.setState({ progress });
	}

	onCloseClick() {
		this.props.history.push('/profiles');
	}

	render() {
		const { progress } = this.state;

		return (
			<div className={classes.intro}>
				<Background progress={progress} />
				<Overlay
					onClose={this.onCloseClick}
					onProgressUpdate={this.onProgressUpdate}
				/>
			</div>
		);
	}
}

Intro.propTypes = {

};

export default withRouter(Intro);