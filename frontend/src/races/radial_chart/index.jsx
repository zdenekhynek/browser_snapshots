import React from 'react';
import PropTypes from 'prop-types';
import { scaleLinear } from 'd3-scale';
import { radialArea, curveCardinal } from 'd3-shape';

import COLORS from '../colors';
import getMetricStyle from '../metric_styles';
import { getAreaChartDefs } from '../patterns';

import classes from './radial_chart.css';

export function renderPath(colorIndex, metric) {
  const numPoints = 20;
  const angleScale = scaleLinear().domain([0, numPoints]).range([0, 360]);
  const radiusScale = scaleLinear().domain([0, 20]).range([0, 60]);
  const innerRadius = 21;

  const data = [];
  for (let i = 0; i < numPoints; i += 1) {
    data.push({
      x: i,
      y0: innerRadius,
      y: Math.round(Math.random() * 20),
    });
  }

  //  just repeat first point at the end of an array
  data.push(data[0]);

  const style = getMetricStyle(metric, colorIndex);

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

  return (
    <svg className={classes.svg}>
      {getAreaChartDefs(colorIndex, COLORS[colorIndex])}
      <path
        className={classes.path}
        style={style}
        d={areaFn(data)}
      />
    </svg>
  );
}

const RadialChart = ({ index }) => {
  const arr = ['temperature', 'noise'];
  const renderedPaths = arr.map((d) => renderPath(index, d));

  return (
    <div className={classes.radialChart}>
      {renderedPaths}
    </div>
  );
};

RadialChart.propTypes = {
  className: PropTypes.string,
};

RadialChart.defaultProps = {
  className: '',
};

export default RadialChart;
