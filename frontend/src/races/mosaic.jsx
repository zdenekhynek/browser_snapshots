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

import classes from './mosaic.css';

export const formatter = format(',');
export const ratioFormatter = format('.3f');

export const COLORS = [
  '#AA3939',
  '#AA6C39',
  '#226666',
  '#2D882D',
];

export const MARGIN = { top: 20, right: 20, bottom: 30, left: 40 };

class Pizza extends Component {
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
    const { xMap, yMap, sizeMap, colorMap } = this.props;

    const thumbUrl = getVideoThumbnail(t.get('url'));
    const backgroundImage = `url(${thumbUrl})`;
    const imageStyle = { backgroundImage };

    const even = i % 2 === 0;
    const imageWrapClass = (even) ? classes.imageWrap : classes.imageWrapRight;
    const imageWrapInnerClass = (even) ?
      classes.imageWrapInner : classes.imageWrapInnerRight;
    const imageClass = (even) ? classes.image : classes.imageRight;
    const titleClass = (even) ? classes.title : classes.titleRight;
    const overlayClass = (even) ? classes.overlay : classes.overlayRight;

    const tObj = t.toJS();
    const color = colorMap(tObj);
    const backgroundColor = color;
    const overlayStyle = { backgroundColor };

    return (
      <div
        className={classes.item}
        onMouseOver={() => {
          this.onMouseOver(t, i);
        }}
        onMouseOut={this.onMouseOut.bind(this)}
      >
        <div className={imageWrapClass} style={overlayStyle}>
          <div className={imageWrapInnerClass}>
            <div className={imageClass} style={imageStyle} />
            <div className={overlayClass} style={overlayStyle} />
          </div>
        </div>
        <p className={titleClass}>{t.get('title')}</p>
      </div>
    );

    //    <span className={classes.line} />
    //        <span className={classes.number}>{i}</span>

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
      <div className={classes.mosaic}>
        {this.renderThumbnails(tasks.reverse())}
      </div>
    );
  }
}

Pizza.propTypes = {
  tasks: PropTypes.object,
};

Pizza.defaultProps = {
  tasks: List(),
};
// Create the config
const config = { monitorHeight: true, monitorWidth: true };

// Call SizeMe with the config to get back the HOC.
const sizeMeHOC = sizeMe(config);

// Wrap your component with the HOC.
export default sizeMeHOC(Pizza);
