import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { easeLinear, easeCubic } from 'd3-ease';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { radialArea, curveCardinal } from 'd3-shape';

import COLORS from '../colors';
import getMetricStyle from '../metric_styles';
import { getAreaChartDefs } from '../patterns';

import classes from './radial_chart.css';

class RadialChart extends Component {
  constructor(props) {
    super(props);

    this.els = {
      temperature: null,
      pollution: null,
      noise: null,
    };

    this.state = { random: 0 };

    setInterval(() => {
      this.setState({ random: Math.random() });
    }, 1500);
  }

  componentDidMount() {
    this.updateData();

    setTimeout(() => {
      this.setState({ random: Math.random() });
    }, 25);
  }

  componentDidUpdate() {
    this.updateData();
  }

  updateData() {
    Object.keys(this.els).forEach((key) => {
      const el = this.els[key];

      if (el) {
        this.updatePath(el, key);
      }
    });
  }

  updatePath(el, metric) {
    const numPoints = 20;
    const angleScale = scaleLinear().domain([0, numPoints]).range([0, 360]);
    const radiusScale = scaleLinear().domain([0, 20]).range([0, 60]);
    const innerRadius = 21;

    const data = [];
    for (let i = 0; i < numPoints; i += 1) {
      data.push({
        x: i,
        y0: innerRadius,
        y: 2 + Math.round(Math.random() * 15),
      });
    }

    //  just repeat first point at the end of an array
    data.push(data[0]);

    const areaFn = radialArea()
      .curve(curveCardinal)
      .angle((d, i) => {
        return angleScale(i) * Math.PI / 180;
      })
      .innerRadius((d) => {
        return radiusScale(d.y0);
      })
      .outerRadius((d) => {
        return radiusScale(d.y0 + d.y);
      });

    const pathString = areaFn(data);

    const selection = select(el).selectAll(`.${classes.path}`)
      .data(data);

    selection.transition().duration(1500).ease(easeLinear).attr('d', (d) => {
      return pathString;
    });
  }

  renderPath(colorIndex, metric) {
    const style = getMetricStyle(metric, colorIndex);

    return (
      <svg key={metric} className={classes.svg}>
        {getAreaChartDefs(colorIndex, COLORS[colorIndex])}
        <g
          ref={(el) => { this.els[metric] = el; }}
        >
          <path
            className={classes.path}
            style={style}
          />
        </g>
      </svg>
    );
  }

  render() {
    const { index } = this.props;
    const arr = ['temperature', 'noise'];
    const renderedPaths = arr.map((d) => this.renderPath(index, d));

    return (
      <div className={classes.radialChart}>
        {renderedPaths}
      </div>
    );
  }
}

RadialChart.propTypes = {
  className: PropTypes.string,
};

RadialChart.defaultProps = {
  className: '',
};

export default RadialChart;
