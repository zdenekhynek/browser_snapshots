import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import sizeMe from 'react-sizeme';
import { select, event } from 'd3-selection';
import { format } from 'd3-format';
import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import { min, max } from 'd3-array';

import Thumb from './thumb';

import classes from './snake.css';

export const formatter = format(',');
export const ratioFormatter = format('.3f');

export const COLORS = [
  '#AA3939',
  '#AA6C39',
  '#226666',
  '#2D882D',
];

export const MARGIN = { top: 20, right: 20, bottom: 30, left: 40 };

class Snake extends Component {
  constructor(props) {
    super(props);

    this.state = { tooltip: null };

    this.chart = null;
    this.svg = null;
  }

  onMouseOver(t, i) {
    const tooltip = t.set('index', i);
    this.setState({ tooltip });
  }

  onMouseOut() {
    this.setState({ tooltip: null });
  }

  renderPath(task, i) {
    const { lineFn } = this.props;
    const pathString = lineFn(task.toJS());

    const stroke = COLORS[i];

    return (
      <path
        className={classes.progress}
        style={{ stroke }}
        d={pathString}
      />
    );
  }

  renderThumbnail(t, i) {
    const { xMap, yMap, sizeMap } = this.props;

    return (
      <Thumb
        key={i}
        index={i}
        data={t}
        xMap={xMap}
        yMap={yMap}
        sizeMap={sizeMap}
        onMouseOver={this.onMouseOver.bind(this)}
        onMouseOut={this.onMouseOut.bind(this)}
      />
    );
  }

  renderThumbnails(tasks, i) {
    return (
      <div key={i} className={classes.thumbs}>
        {tasks.map(this.renderThumbnail.bind(this))}
      </div>
    );
  }

  renderTooltip() {
    const { xMap, yMap } = this.props;
    const { tooltip } = this.state;

    const index = tooltip.get('index');
    const x = xMap(tooltip.toJS());
    const y = yMap(tooltip.toJS(), index);
    const style = { left: x, top: y };

    return (
      <ul className={classes.tooltip} style={style}>
        <li>Title: {tooltip.get('title')}</li>
        <li>Views: {formatter(tooltip.get('views'))}</li>
        <li>Likes: {formatter(tooltip.get('likes'))}</li>
        <li>Dislikes: {formatter(tooltip.get('dislikes'))}</li>
        <li>Ratio: {ratioFormatter(tooltip.get('ratio'))}</li>
        <li>Temperature: {formatter(tooltip.get('temperature'))}</li>
        <li>Engagment ratio: {formatter(tooltip.get('engagementRatio'))}</li>
      </ul>
    );
  }

  render() {
    const { tasks } = this.props;

    const { tooltip } = this.state;
    const renderedTooltip = (tooltip) ? this.renderTooltip(tooltip) : null;

    return (
      <div className={classes.snake}>
        <div>
          {this.renderThumbnails(tasks)}
        </div>
        <svg className={classes.svg}>
          {this.renderPath(tasks)}
        </svg>
        {renderedTooltip}
      </div>
    );
  }
}

Snake.propTypes = {
  tasks: PropTypes.object,
};

Snake.defaultProps = {
  tasks: List(),
};
// Create the config
const config = { monitorHeight: true, monitorWidth: true };

// Call SizeMe with the config to get back the HOC.
const sizeMeHOC = sizeMe(config);

// Wrap your component with the HOC.
export default sizeMeHOC(Snake);
