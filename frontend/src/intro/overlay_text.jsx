import React, { Component } from 'react';
import PropTypes from 'prop-types';

export const TEXTS = [
	{ id: 1, text: '<strong>Sure</strong>. You\'re a strong invidual<br />living in a democratic society.' },
	{ id: 2, text: 'But are you really <strong>in control</strong> of<br />how you spend your time?' },
	{ id: 3, text: 'Does choice become an <strong>illusion</strong> when an infinite<br />amount of created content is the next click away?' },
	{ id: 4, text: 'Does an algorithm designed to keep us hooked<br />have our <strong>best interest</strong> at heart?' },
	{ id: 5, text: 'One that understands the human nature<br />of always wanting <strong>more</strong>.' },
	{ id: 6, text: 'One that wants to keep us <strong>engaged</strong>.<br />And <strong>outraged</strong>.' },
];

import classes from './overlay_text.css';

class OverlayText extends Component {
	render() {
		const { progress } = this.props;
		const activeText = TEXTS[progress];

		return (
			<div
				className={classes.overlayText}
				key={activeText.id}
				dangerouslySetInnerHTML={{ __html: activeText.text }} 
			/>
		);
	}
}

OverlayText.propTypes = {
	progress: PropTypes.number,
};

OverlayText.defaultProps = {
	progress: 0,
};

export default OverlayText;
