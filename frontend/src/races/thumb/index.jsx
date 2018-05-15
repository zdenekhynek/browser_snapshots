import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { format } from 'd3-format';

import { getVideoThumbnail } from '../utils';

import classes from './thumb.css';

export const formatter = format(',');
export const ratioFormatter = format('.3f');

export const COLORS = [
  '#AA3939',
  '#AA6C39',
  '#226666',
  '#2D882D',
];

class Thumb extends Component {
  constructor(props) {
    super(props);

    this.chart = null;
    this.svg = null;
  }

  render() {
    const { index, data, xMap, yMap, sizeMap } = this.props;
    const thumbUrl = getVideoThumbnail(data.get('url'));

    const tObj = data.toJS();
    const left = xMap(tObj);
    const top = yMap(tObj, index);
    const width = sizeMap(tObj);
    const style = { left, top, width };

    return (
      <img
        src={thumbUrl}
        className={classes.thumb}
        style={style}
        alt="thumb"
        onMouseOver={() => {
          this.props.onMouseOver(data, index);
        }}
        onMouseOut={() => {
          this.props.onMouseOut();
        }}
      />
    );
  }
}

Thumb.propTypes = {};

Thumb.defaultProps = {};

export default Thumb;
