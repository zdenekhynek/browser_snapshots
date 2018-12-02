import React, { Component } from 'react';

import classes from './skip_button.css';

export const MIN_TIME = 13;

class SkipButton extends Component {
	constructor(props) {
		super(props);

		this.state = { secondsLapsed: 0, displayed: false, skippable: false };

		this.interval;
		this.startPlayTime;

		this.onClick = this.onClick.bind(this);
	}

	componentDidMount() {
		this.startPlayTime = new Date();
		this.interval = setInterval(this.onInterval.bind(this), 500);
	}

	componentWillUnmount() {
		if (this.autoPlay) {
			clearInterval(this.interval);
		}
	}

	onInterval() {
		const timeLapsed = new Date() - this.startPlayTime;
		const secondsLapsed = Math.floor(timeLapsed / 1000);

		const displayed = (secondsLapsed > 3);
		const skippable = (secondsLapsed > 12);

		this.setState({ secondsLapsed, displayed, skippable });
	}

	onClick() {
		if (this.state.skippable) {
			this.props.onClick();	
		}
	}

	render() {
		const { onClick } = this.props;
		const { secondsLapsed, displayed, skippable } = this.state;
		
		if (!displayed) {
			return null;
		}

		const text = (!skippable) ? `You can skip intro in ${MIN_TIME - secondsLapsed}s` : 'Skip intro';

		return (
			<div className={classes.skipButton} onClick={this.onClick}>{text}</div>
		);
	}
}


export default SkipButton;