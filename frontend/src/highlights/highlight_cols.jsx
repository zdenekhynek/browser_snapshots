import React, { Component } from 'react';

import { getVideoThumbnail } from '../races/utils';

import classes from './highlight_cols.css';

export const renderTask = (task, i) => {
	console.log('task', task);
	const title = task.get('title');
	const thumbUrl = getVideoThumbnail(task.get('url'));

	return (
		<div className={classes.task}>
			<img className={classes.thumb} src={thumbUrl} />
			<div className={classes.index}>{i + 1}</div>
			<div className={classes.title}>{title}</div>
		</div>
	);
}

export const renderCol = (tasks) => {
	let newTasks = tasks.shift();
	newTasks = tasks.pop();

	return (
		<div className={classes.col}>
			<div className={classes.innerCol}>
				{newTasks.map(renderTask)}
			</div>
		</div>
	);
};

class HighlightCols extends Component {
	render() {
		const { tasks } = this.props;
		
		return (
			<div className={classes.highlightCols}>{tasks.map(renderCol)}</div>
		);
	}
}

export default HighlightCols;