import React, { Component } from 'react';

import classes from './overlay_button.css';

export const RADIUS = 63 / 2;
export const DEFAULT_STROKE_DASHOFFSET = RADIUS * 2 * Math.PI;

class OverlayButton extends Component {
	constructor(props) {
		super(props);

		this.state = { strokeDashoffset: DEFAULT_STROKE_DASHOFFSET, progress: -1 };

		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		this.props.onClick();
	}

	static getDerivedStateFromProps(props, state) {
		if (props.progress !== state.progress) {
			return { strokeDashoffset: DEFAULT_STROKE_DASHOFFSET, transitionDuration: '0s', progress: props.progress };
		}

		return state;
	}

	componentDidMount() {
		this.startAnimation();
	}

	componentDidUpdate(prevProps) {
		const hasPropsChanged = prevProps.progress !== this.props.progress;

		if (hasPropsChanged) {
			this.startAnimation();
		}
	}

	startAnimation() {
		setTimeout(() => {
			this.setState({ strokeDashoffset: 0, transitionDuration: '5.6s' });
		}, 17);
	}

	render() {
		const { onClick } = this.props;
		const { strokeDashoffset, transitionDuration } = this.state;
		const style = { strokeDashoffset, transitionDuration };

		return (
			<div className={classes.overlayButton} onClick={this.onClick}>
				<svg className={classes.svg}>
					<circle cx={RADIUS} cy={RADIUS} r="27.5" className={classes.circle} style={style} />
					<g className={classes.icon} style={{ "fill": "#FFFFFF" }}>
						<polygon points="15.77,10.2 0,0 0,20.4 "/>
						<rect x="19" y="0.2" width="3" height="20"/>
					</g>
				</svg>
			</div>
		);
	}
}

export default OverlayButton;
