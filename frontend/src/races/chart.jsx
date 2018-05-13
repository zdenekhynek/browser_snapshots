import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Map } from 'immutable';
import { connect } from 'react-redux';
import { select, event } from 'd3-selection';
import { format } from 'd3-format';
import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import { axisLeft, axisBottom } from 'd3-axis';
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
  constructor(props) {
    super(props);

    this.svg = null;
  }

  componentDidMount() {
    this.updateChart();
  }

  componentDidUpdate() {
    this.updateChart();
  }

  updateChart() {
    const { tasks } = this.props;

    const data = tasks.reduce((acc, t, i) => {
      const newT = t.map((d) => {
        return d.set('index', i);
      });
      acc.push(newT.toJS());
      return acc;
    }, []);

    const width = 960 - MARGIN.left - MARGIN.right;
    const height = 350 - MARGIN.top - MARGIN.bottom;

    // setup x
    const xValue = (d, i) => i;
    const xScale = scaleLinear().range([0, width]);
    const xMap = (d, i) => xScale(xValue(d, i));
    const xAxis = axisBottom().scale(xScale);

    // setup y
    const yValue = (d) => {
      return (d.temperature && !Number.isNaN(d.temperature)) ? d.temperature : 0;
    };
    const yScale = scaleLinear().range([height, 0]); // value -> display
    const yMap = (d) => yScale(yValue(d));
    const yAxis = axisLeft().scale(yScale);

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

    // add the graph canvas to the body of the webpage
    // var svg = d3.select(this.svg).append("svg")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    // .append("g")
    //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // add the tooltip area to the webpage
    const tooltip =
      select(this.svg).append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

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
        .attr('href', (d) => getVideoThumbnail(d.url))
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

          select(this.tooltip)
            .html(htmlString)
            .style('display', 'block')
            .style('left', `${(event.pageX + 15)}px`)
            .style('top', `${(event.pageY)}px`);
        })
        .on('mouseout', (d) => {
          select(this.tooltip)
            .style('display', 'none');
        });

    dots.merge(dotsEnter)
      .attr('r', sizeMap)
      .attr('x', xMap)
      .attr('y', yMap)
      .style('fill', colorMap);

    dots.exit().remove();
  }

  render() {
    const transformString = `translate(${MARGIN.top}px,${MARGIN.left}px)`;
    const style = { transform: transformString };

    return (
      <div className={classes.chart}>
        <svg className={classes.svg}>
          <g
            ref={(el) => this.svg = el}
            style={style}
          />
        </svg>
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

export default Chart;
