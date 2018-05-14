import React, { Component } from 'react';
import sizeMe from 'react-sizeme';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { select, event } from 'd3-selection';
import { format } from 'd3-format';
import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import { min, max } from 'd3-array';

import { getVideoThumbnail } from './utils';

import classes from './chart.css';

export const formatter = format(',');
export const ratioFormatter = format('.3f');

export const COLORS = [
  '#AA3939',
  '#AA6C39',
  '#226666',
  '#2D882D',
];

export const MARGIN = { top: 20, right: 20, bottom: 30, left: 40 };

class Chart extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const { tasks, size } = nextProps;
    const { width } = size;

    const data = tasks.reduce((acc, t, i) => {
      const newT = t.map((d) => {
        return d.set('index', i);
      });
      acc.push(newT.toJS());
      return acc;
    }, []);

    const chartWidth = width - MARGIN.left - MARGIN.right;
    const chartHeight = 600 - MARGIN.top - MARGIN.bottom;

    // setup x
    const xValue = (d, i) => i;
    const xScale = scaleLinear().range([0, chartWidth]);
    const xMap = (d, i) => xScale(xValue(d, i));

    // setup y
    const yValue = (d) => {
      return (d.temperature && !Number.isNaN(d.temperature)) ? d.temperature : 0;
    };
    const yScale = scaleLinear().range([chartHeight, 0]); // value -> display
    const yMap = (d) => yScale(yValue(d));

    const sizeValue = (d) => d.views;
    const sizeScale = scaleLinear().range([2, 20]);
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

    xScale.domain([-1, max(dataLens) + 1]);
    yScale.domain([
      //  just hardcode when using custom ration
      0,
      100,
      //  min(flattenedData, yValue),
      //  max(flattenedData, yValue),
    ]);
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
      lineFn,
    };
  }

  constructor(props) {
    super(props);

    this.chart = null;
    this.svg = null;
  }

  updateChart() {
    const { tasks, size } = this.props;
    const { width, height } = size;

    const data = tasks.reduce((acc, t, i) => {
      const newT = t.map((d) => {
        return d.set('index', i);
      });
      acc.push(newT.toJS());
      return acc;
    }, []);

    const chartWidth = width - MARGIN.left - MARGIN.right;
    const chartHeight = 600 - MARGIN.top - MARGIN.bottom;

    // setup x
    const xValue = (d, i) => i;
    const xScale = scaleLinear().range([0, chartWidth]);
    const xMap = (d, i) => xScale(xValue(d, i));

    // setup y
    const yValue = (d) => {
      return (d.temperature && !Number.isNaN(d.temperature)) ? d.temperature : 0;
    };
    const yScale = scaleLinear().range([chartHeight, 0]); // value -> display
    const yMap = (d) => yScale(yValue(d));

    const sizeValue = (d) => d.views;
    const sizeScale = scaleLinear().range([2, 20]);
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

    xScale.domain([-1, max(dataLens) + 1]);
    yScale.domain([
      //  just hardcode when using custom ration
      0,
      100,
      //  min(flattenedData, yValue),
      //  max(flattenedData, yValue),
    ]);
    sizeScale.domain([min(flattenedData, sizeValue) - 1, max(flattenedData, sizeValue) + 1]);

    // draw dots
    const racers = select(this.svg)
      .selectAll('.racer')
      .data(data);

    const racersEnter =
      racers
        .enter()
        .append('g')
        .attr('class', 'racer');

    racersEnter
      .append('path')
      .attr('class', classes.progress);

    racers.exit().remove();

    const lineFn = line()
      .x(xMap)
      .y(yMap);

    racers.merge(racersEnter).selectAll(`.${classes.progress}`)
      .attr('d', lineFn)
      .style('stroke', colorMap);

    const dots = racers.merge(racersEnter).selectAll(`.${classes.dot}`)
      .data((d, i) => d);

    const dotsEnter =
      dots
        .enter()
        .append('image')
        .attr('class', classes.dot)

        .on('mouseover', (d) => {
          const htmlString = `
            <ul>
              <li>Title: ${d.title}</li>
              <li>Views: ${formatter(d.views)}</li>
              <li>Likes: ${formatter(d.likes)}</li>
              <li>Dislikes: ${formatter(d.dislikes)}</li>
              <li>Ratio: ${ratioFormatter(d.ratio)}</li>
              <li>Temperature: ${formatter(d.temperature)}</li>
              <li>Engagment ratio: ${formatter(d.engagementRatio)}</li>
            </ul>
          `;

          const pageY = yMap(d);
          //  console.log('pageY', pageY, 'event', event, this.chart.scrollTop);

          select(this.tooltip)
            .html(htmlString)
            .style('display', 'block')
            .style('left', `${(event.pageX)}px`)
            .style('top', `${pageY}px`);
        })
        .on('mouseout', (d) => {
          select(this.tooltip)
            .style('display', 'none');
        });

    dots.merge(dotsEnter)
      .attr('r', sizeMap)
      .attr('href', (d) => getVideoThumbnail(d.url))
      .attr('x', xMap)
      .attr('y', yMap)
      .style('fill', colorMap);

    dots.exit().remove();
  }

  renderPath(task, i) {
    const { lineFn } = this.state;
    const pathString = lineFn(task.toJS());

    const stroke = COLORS[i];
    console.log('stroke', stroke);

    return (
      <path
        className={classes.progress}
        style={{ stroke }}
        d={pathString}
      />
    );
  }

  renderPaths() {
    const { tasks } = this.props;

    return (
      <g>
        {tasks.map(this.renderPath.bind(this))}
      </g>
    );
  }

  renderThumbnail(t, i) {
    const { xMap, yMap } = this.state;
    const thumbUrl = getVideoThumbnail(t.get('url'));

    const tObj = t.toJS();
    const left = xMap(tObj, i);
    const top = yMap(tObj);
    const style = { left, top };

    return (
      <img
        key={i}
        src={thumbUrl}
        className={classes.thumb}
        style={style}
        alt="thumb"
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

    const transformString = `translate(${MARGIN.top}px,${MARGIN.left}px)`;
    const style = { transform: transformString };

    return (
      <div
        ref={(el) => this.chart = el}
        className={classes.chart}
      >
        <svg className={classes.svg}>
          {tasks.map(this.renderPaths.bind(this))}
        </svg>
        <div>
          {tasks.map(this.renderThumbnails.bind(this))}
        </div>
        <div className={classes.tooltip} ref={(el) => this.tooltip = el} />
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
