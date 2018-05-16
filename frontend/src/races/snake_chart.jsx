import React, { Component } from 'react';
import sizeMe from 'react-sizeme';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { select, event } from 'd3-selection';
import { format } from 'd3-format';
import { scaleLinear, scaleLog } from 'd3-scale';
import { line } from 'd3-shape';
import { min, max } from 'd3-array';

import { getVideoThumbnail } from './utils';
import Snake from './snake';

import classes from './snake_chart.css';

export const formatter = format(',');
export const ratioFormatter = format('.3f');

export const COLORS = [
  '#AA3939',
  '#AA6C39',
  '#226666',
  '#2D882D',
];

export const MARGIN = { top: 20, right: 20, bottom: 30, left: 240 };

export function getWidth(width) {
  return (width / 3);
}

class Chart extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const { tasks, size } = nextProps;
    const { width, height } = size;

    const data = tasks.reduce((acc, t, i) => {
      const newT = t.map((d) => {
        return d.set('index', i);
      });
      acc.push(newT.toJS());
      return acc;
    }, []);

    //  just width of the columns
    const chartWidth = getWidth(width) - MARGIN.left - MARGIN.right;
    const chartHeight = height - MARGIN.top - MARGIN.bottom;

    // setup x
    const xValue = (d) => {
      return (d.temperature && !Number.isNaN(d.temperature)) ? d.temperature : 0;
    };
    const xScale = scaleLinear().range([0, chartWidth]);
    const xMap = (d) => xScale(xValue(d));

    // setup y
    const yValue = (d, i) => i;
    const yScale = scaleLinear().range([chartHeight, 0]); // value -> display
    const yMap = (d, i) => yScale(yValue(d, i));

    const sizeValue = (d) => d.views;
    const sizeScale = scaleLog().range([60, 180]);
    const sizeMap = (d) => sizeScale(sizeValue(d));

    let colorIndex = -1;
    const colorMap = (d) => {
      if (typeof d.index !== 'undefined') {
        return COLORS[d.index];
      }

      colorIndex += 1;
      return COLORS[colorIndex];
    };

    // don't want dots overlapping axis, so add in buffer to data domain
    const flattenedData = data.reduce((acc, d) => {
      return acc.concat(d);
    }, []);
    const dataLens = data.map((d) => {
      return d.length;
    });

    xScale.domain([
      //  just hardcode when using custom ration
      0,
      200,
      //  min(flattenedData, yValue),
      //  max(flattenedData, yValue),
    ]);
    yScale.domain([-1, max(dataLens) + 1]);
    sizeScale.domain([
      min(flattenedData, sizeValue) - 1,
      max(flattenedData, sizeValue) + 1,
    ]);

    const lineFn = line()
      .x(xMap)
      .y(yMap);

    return {
      xMap,
      yMap,
      sizeMap,
      lineFn,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      tooltip: null,
    };

    this.chart = null;
    this.svg = null;
  }

  onMouseOver(t, i, index) {
    const tooltip = t.set('index', i).set('offset', index);

    this.setState({ tooltip });
  }

  onMouseOut() {
    this.setState({ tooltip: null });
  }

  renderTooltip() {
    const { size } = this.props;
    const { width } = size;
    const { xMap, yMap, tooltip } = this.state;
    const index = tooltip.get('index');

    const offset = getWidth(width) * tooltip.get('offset');

    const x = xMap(tooltip.toJS()) + offset;
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

  renderSnake(t, i) {
    return (
      <div className={classes.col}>
        <div className={classes.innerCol}>
          <Snake
            index={i}
            tasks={t}
            onMouseOver={this.onMouseOver.bind(this)}
            onMouseOut={this.onMouseOut.bind(this)}
            {...this.state}
          />
        </div>
      </div>
    );
  }

  render() {
    const { tasks } = this.props;
    const { tooltip } = this.state;

    const renderedTooltip = (tooltip) ? this.renderTooltip(tooltip) : null;

    return (
      <div
        ref={(el) => this.chart = el}
        className={classes.chart}
      >
        {tasks.map(this.renderSnake.bind(this))}
        {renderedTooltip}
      </div>
    );
  }
}

Chart.propTypes = {
  tasks: PropTypes.object,
};

Chart.defaultProps = {
  tasks: List(),
};

// Create the config
const config = { monitorHeight: true, monitorWidth: true };

// Call SizeMe with the config to get back the HOC.
const sizeMeHOC = sizeMe(config);

// Wrap your component with the HOC.
export default sizeMeHOC(Chart);
