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

    this.chart = null;
    this.svg = null;
  }

  onMouseOver(t, i) {
    this.props.onMouseOver(t, i);
  }

  onMouseOut() {
    this.props.onMouseOut();
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

  render() {
    const { tasks } = this.props;

    return (
      <div className={classes.snake}>
        <div>
          {this.renderThumbnails(tasks)}
        </div>
        <svg className={classes.svg}>
          {this.renderPath(tasks)}
        </svg>
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
