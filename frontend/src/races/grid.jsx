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
import { getVideoThumbnail } from './utils';

import classes from './grid.css';

export const formatter = format(',');
export const ratioFormatter = format('.3f');

export const COLORS = [
  '#AA3939',
  '#AA6C39',
  '#226666',
  '#2D882D',
];

export const MARGIN = { top: 20, right: 20, bottom: 30, left: 40 };

class Grid extends Component {
  constructor(props) {
    super(props);

    this.chart = null;
    this.svg = null;
  }

  onMouseOver(t, i) {
    const { index } = this.props;
    this.props.onMouseOver(t, i, index);
  }

  onMouseOut() {
    this.props.onMouseOut();
  }

  renderThumbnail(t, i) {
    const { xMap, yMap, sizeMap } = this.props;

    const thumbUrl = getVideoThumbnail(t.get('url'));
    const backgroundImage = `url(${thumbUrl})`;
    const imageStyle = { backgroundImage };

    return (
      <div
        className={classes.item}
        onMouseOver={() => {
          this.onMouseOver(t, i);
        }}
        onMouseOut={this.onMouseOut.bind(this)}
      >
        <div className={classes.image} style={imageStyle} />
        <p className={classes.title}>{t.get('title')}</p>
        <span className={classes.line} />
        <span className={classes.number}>{i}</span>
      </div>
    );

    // return (
    //   <Thumb
    //     key={i}
    //     index={i}
    //     data={t}
    //     xMap={xMap}
    //     yMap={yMap}
    //     sizeMap={sizeMap}
    //     onMouseOver={this.onMouseOver.bind(this)}
    //     onMouseOut={this.onMouseOut.bind(this)}
    //   />
    // );
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
      <div className={classes.grid}>
        <div>
          {this.renderThumbnails(tasks.reverse())}
        </div>
      </div>
    );
  }
}

Grid.propTypes = {
  tasks: PropTypes.object,
};

Grid.defaultProps = {
  tasks: List(),
};
// Create the config
const config = { monitorHeight: true, monitorWidth: true };

// Call SizeMe with the config to get back the HOC.
const sizeMeHOC = sizeMe(config);

// Wrap your component with the HOC.
export default sizeMeHOC(Grid);
