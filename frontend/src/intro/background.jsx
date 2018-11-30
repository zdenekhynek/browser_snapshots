import React, { Component } from 'react';

import classes from './background.css';

const thumbReq = require.context('../assets/images/thumbs/');

export const CENTER_INDICES = [96, 97, 98, 111, 113, 126, 127, 128];

export const getOpacityForProgress = (progress) => {
	return (progress > 0)? 1: 0;
};

export const getScaleForProgress = (progress) => {
	return (progress > 1)? .35: 1;
};

export const getStyleForProgress = (progress) => {
	const opacity = getOpacityForProgress(progress);
	const transform = `scale(${getScaleForProgress(progress)})`;
	return { opacity, transform };
};

export const renderTile = (index, progress) => {
	const isActiveTile = (progress > 0) && CENTER_INDICES.includes(index);
	const className = (isActiveTile)? classes.activeTile : classes.tile;
	
	const animationDelay = `${Math.random() * 5}s`;
	const imageIndex = index % 7;
	const thumbName = `./image_${imageIndex}.jpg`;
	const thumbUrl = thumbReq(thumbName);
	
	const style = { animationDelay };

	return (
		<div className={className}>
			<img src={thumbUrl} className={classes.tileImage} style={style} />
		</div>
	);
};

class Background extends Component {
	render() {
		const { progress } = this.props;
		
		const numPerRow = 15;
		const tiles = new Array(numPerRow * numPerRow).fill(0);

		const style = getStyleForProgress(progress);
		
		return (
			<div className={classes.background}>
				<div className={classes.grid} style={style}>
					{
						tiles.map((tile, i) => renderTile(i, progress))
					}
				</div>
			</div>
		);
	}
}

export default Background;
