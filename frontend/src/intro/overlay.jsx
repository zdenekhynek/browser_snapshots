import React, { Component } from 'react';
import PropTypes from 'prop-types';

import OverlayButton from './overlay_button';
import OverlayText, { TEXTS } from './overlay_text';
import SkipButton from './skip_button';

export const AUTOPLAY_INTERVAL = 7000;
export const TEXT_LEN = TEXTS.length;

import classes from './overlay.css';

class Overlay extends Component {
	constructor(props) {
		super(props);

		this.state = { progress: 0 };
		this.autoPlay;

		this.nextAutoplay = this.nextAutoplay.bind(this);
		this.onCloseClick = this.onCloseClick.bind(this);
		this.onResetClick = this.onResetClick.bind(this);
		this.startPlayTime;
	}

	onCloseClick() {
		this.props.onClose();
	}

	onResetClick() {
		resetInterval();
		this.setState({ progress: 0 });
	}

	componentDidMount() {
		this.resetInterval();
		this.startPlayTime = new Date();
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

		if (progress === TEXT_LEN - 1) {
			this.onCloseClick();
			return;
		}

		const newProgress = (progress < TEXT_LEN - 1)? progress + 1 : 0; 

		this.props.onProgressUpdate(newProgress);
		this.setState({ progress: newProgress });

		//	make sure we don't have now ghost autoplays after the button was clicked 
		this.resetInterval();
	}

	renderCloseBtn() {
		return (
			<div className={classes.closeIcon} onClick={this.onCloseClick}>
				<svg
					className={classes.svg}
					viewBox="0 0 348.333 348.334"
				>
					<path d="M336.559,68.611L231.016,174.165l105.543,105.549c15.699,15.705,15.699,41.145,0,56.85   c-7.844,7.844-18.128,11.769-28.407,11.769c-10.296,0-20.581-3.919-28.419-11.769L174.167,231.003L68.609,336.563   c-7.843,7.844-18.128,11.769-28.416,11.769c-10.285,0-20.563-3.919-28.413-11.769c-15.699-15.698-15.699-41.139,0-56.85   l105.54-105.549L11.774,68.611c-15.699-15.699-15.699-41.145,0-56.844c15.696-15.687,41.127-15.687,56.829,0l105.563,105.554   L279.721,11.767c15.705-15.687,41.139-15.687,56.832,0C352.258,27.466,352.258,52.912,336.559,68.611z" style={{ "fill": "#fff" }}></path>
				</svg>
			</div>
		);
	}

	render() {
		const { progress } = this.state;

		return (
			<div className={classes.overlayWrapper}>
				<div className={classes.overlay}>
					{this.renderCloseBtn()}
					<div>
						<OverlayButton progress={progress} onClick={this.nextAutoplay} />
					</div>
					<div>
						<OverlayText progress={progress} />
					</div>
					<SkipButton onClick={this.onCloseClick} />
				</div>
			</div>
		);
	}
}

Overlay.propTypes = {
	onClose: PropTypes.func,
	onProgressUpdate: PropTypes.func,
};

export default Overlay;