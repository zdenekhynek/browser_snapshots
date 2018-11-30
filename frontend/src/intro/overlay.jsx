import React, { Component } from 'react';
import PropTypes from 'prop-types';

import OverlayButton from './overlay_button';
import OverlayText, { TEXTS } from './overlay_text';

export const AUTOPLAY_INTERVAL = 5000;
export const TEXT_LEN = TEXTS.length;

import classes from './overlay.css';

class Overlay extends Component {
	constructor(props) {
		super(props);

		this.state = { progress: 0 };
		this.autoPlay;

		this.nextAutoplay = this.nextAutoplay.bind(this);
	}

	componentDidMount() {
		this.resetInterval();
	}

	componentWillUnmount() {
		this.clearInterval();
	}

	resetInterval() {
		this.clearInterval();
		this.autoPlay = setInterval(this.nextAutoplay, AUTOPLAY_INTERVAL);
	}

	clearInterval() {
		if (this.autoPlay) {
			clearInterval(this.autoPlay);
		}
	}

	nextAutoplay() {
		const { progress } = this.state;
		const newProgress = (progress < TEXT_LEN - 1)? progress + 1 : 0; 

		this.props.onProgressUpdate(newProgress);
		this.setState({ progress: newProgress });

		//	make sure we don't have now ghost autoplays after the button was clicked 
		this.resetInterval();
	}

	render() {
		const { progress } = this.state;

		return (
			<div className={classes.overlayWrapper}>
				<div className={classes.overlay}>
					<OverlayButton progress={progress} onClick={this.nextAutoplay} />
					<OverlayText progress={progress} />
				</div>
			</div>
		);
	}
}

Overlay.propTypes = {
	onProgressUpdate: PropTypes.func,
};

export default Overlay;