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

import classes from './chart.css';

export const formatter = format(',');
export const ratioFormatter = format('.3f');

export const COLORS = [
  '#AA3939',
  '#AA6C39',
  '#226666',
  '#2D882D',
];

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
      const newT = t.map((d) => d.set('index', i));
      acc.push(newT.toJS());
      return acc;
    }, []);
    console.log('data', data);

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // setup x
    const xValue = (d, i) => i;
    const xScale = scaleLinear().range([0, width]);
    const xMap = (d, i) => xScale(xValue(d, i));
    const xAxis = axisBottom().scale(xScale);

    // setup y
    const yValue = (d) => d.likes / d.dislikes;
    const yScale = scaleLinear().range([height, 0]); // value -> display
    const yMap = (d) => yScale(yValue(d));
    const yAxis = axisLeft().scale(yScale);

    const sizeValue = (d) => d.views;
    const sizeScale = scaleLinear().range([2, 20]);
    const sizeMap = (d) => sizeScale(sizeValue(d));

    let colorIndex = -1;
    const colorMap = (d) => {
      console.log('d', d, d.index);
      if (d.index) {
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
    yScale.domain([min(flattenedData, yValue) - 1, max(flattenedData, yValue) + 1]);
    sizeScale.domain([min(flattenedData, sizeValue) - 1, max(flattenedData, sizeValue) + 1]);

    // x-axis
    // svg.append("g")
    //     .attr("class", "x axis")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(xAxis)
    //   .append("text")
    //     .attr("class", "label")
    //     .attr("x", width)
    //     .attr("y", -6)
    //     .style("text-anchor", "end")
    //     .text("Calories");

    // // y-axis
    // svg.append("g")
    //     .attr("class", "y axis")
    //     .call(yAxis)
    //   .append("text")
    //     .attr("class", "label")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 6)
    //     .attr("dy", ".71em")
    //     .style("text-anchor", "end")
    //     .text("Protein (g)");

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
        .append('circle')
        .attr('class', classes.dot)

        .on('mouseover', (d) => {
          const htmlString = `
            <ul>
              <li>Title: ${d.title}</li>
              <li>Views: ${formatter(d.views)}</li>
              <li>Likes: ${formatter(d.likes)}</li>
              <li>Dislikes: ${formatter(d.dislikes)}</li>
              <li>Ratio: ${ratioFormatter(d.likes / d.dislikes)}</li>
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
      .attr('cx', xMap)
      .attr('cy', yMap)
      .style('fill', colorMap);

    dots.exit().remove();
  }

  renderAgent(agent, i) {
    const totals = agent.get('totals');

    const backgroundColor = COLORS[i];
    const style = { backgroundColor };

    return (
      <li className={classes.agent} style={style}>
        <h3>{agent.get('name')}: {agent.get('gmail')}</h3>
        <ul>
          <li>Views: {formatter(totals.get('views'))}</li>
          <li>Likes: {formatter(totals.get('likes'))}</li>
          <li>Dislikes: {formatter(totals.get('dislikes'))}</li>
        </ul>
      </li>
    );
  }

  renderAgents() {
    const { agents } = this.props;

    return (
      <ul className={classes.agents}>
        {agents.map(this.renderAgent)}
      </ul>
    );
  }

  render() {
    return (
      <div className={classes.chart}>
        <h3>Race chart</h3>
        <div className={classes.viz}>
          <div className={classes.canvas}>
            <svg className={classes.svg} ref={(el) => this.svg = el} />
            <div className={classes.tooltip} ref={(el) => this.tooltip = el} />
          </div>
          {this.renderAgents()}
        </div>
      </div>
    );
  }
}

export function sum(collection, key) {
  return collection.reduce((sum, x) => sum + x.get(key), 0);
}

export function mapStateToProps({ agents, races }) {
  const activeRace = races.find((r) => r.get('isActive', false), null, Map());
  const tasks = activeRace.get('tasks', List());
  const agentsIds = tasks.reduce((acc, d, i) => acc.push(i), List()).toJS();

  let raceAgents = agents.get('available').filter((a) => {
    return agentsIds.includes(a.get('id'));
  });

  const totals = tasks.map((t) => {
    const total = new Map({
      views: sum(t, 'views'),
      likes: sum(t, 'likes'),
      dislikes: sum(t, 'dislikes'),
    });
    return total;
  });

  raceAgents = raceAgents.map((a, i) => {
    return a.set('totals', totals.get(i));
  });

  return {
    agents: raceAgents,
    tasks,
  };
}

Chart.propTypes = {
  agents: PropTypes.object,
  tasks: PropTypes.object,
};

Chart.defaultProps = {
  agents: List(),
  tasks: List(),
};

export default connect(mapStateToProps)(Chart);