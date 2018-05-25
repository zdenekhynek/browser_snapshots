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
import Grid from './grid';
import Pizza from './pizza';
import Stack from './stack';

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
      //  sort them from the latest
      const newT = t.reverse().map((d) => {
        return d.set('index', i);
      });

      acc.push(newT.toJS());
      return acc;
    }, []);

    //  just width of the columns
    const chartWidth = getWidth(width) - MARGIN.left - MARGIN.right;
    const chartHeight = height - MARGIN.top - MARGIN.bottom;

    // setup x
    const xProp = nextProps.metric || 'temperature';
    const xValue = (d) => {
      return (d[xProp] && !Number.isNaN(d[xProp])) ? d[xProp] : 0;
    };
    const xScale = scaleLinear().range([0, chartWidth]);
    const xMap = (d) => xScale(xValue(d));

    // setup y
    const yValue = (d, i) => i;
    const yScale = scaleLinear().range([chartHeight, 0]); // value -> display
    const yMap = (d, i) => yScale(yValue(d, i));

    const sizeValue = (d) => {
      return 150;
      //  return (d.views && !Number.isNaN(d.views)) ? d.views : 150;
    };
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
      150,
      //  min(flattenedData, yValue),
      //  max(flattenedData, yValue),
    ]);

    //  yScale.domain([-1, max(dataLens) + 1]);
    //  hardcoded y-value domain
    yScale.domain([-1, 22]);

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

    const faceSentiment = (tooltip.get('face_sentiment') || '[]').replace(/'/g, '"');

    //
    const parsedSentiment = JSON.parse(faceSentiment);
    let facesString = '';

    if (parsedSentiment && typeof parsedSentiment.reduce === 'function') {
      const faces = JSON.parse(faceSentiment).reduce((acc, f) => {
        acc.push(f.faceAttributes.emotion);
        return acc;
      }, []);

      facesString = faces.reduce((acc, f) => {
        const stringArr = Object.keys(f).reduce((acc, k) => {
          const value = f[k];
          if (value !== 0) {
            acc.push(`${k}: ${value}`);
          }

          return acc;
        }, []);

        acc.push(stringArr);

        return acc;
      }, []).join(', ');
    }

    const rawToneString = tooltip.get('watson_raw_tone') || '[]';
    const rawTone = JSON.parse(rawToneString);

    let tone = [];

    if (rawTone['document_tone']) {
      tone = rawTone['document_tone'].tones.reduce((acc, t) => {
        const toneString = `${t['tone_name']}: ${t.score}`;
        acc.push(toneString);
        return acc;
      }, []).join(', ');
    }

    //  <li>Ratio: {ratioFormatter(tooltip.get('ratio'))}</li>
    //  <li>Engagment ratio: {formatter(tooltip.get('engagementRatio'))}</li>
    //  <li>Sentiment: {ratioFormatter(tooltip.get('sentiment'))}</li>
    //  <li>Caps sentiment: {ratioFormatter(tooltip.get('caps_sentiment'))}</li>
    //  <li>Punctuation sentiment: {ratioFormatter(tooltip.get('punctuation_sentiment'))}</li>

    return (
      <ul className={classes.tooltip} style={style}>
        <li>Title: {tooltip.get('title')}</li>
        <li>Views: {formatter(tooltip.get('views'))}</li>
        <li>Category: {tooltip.get('category_name')}</li>
        <li>Likes: {formatter(tooltip.get('likes'))}</li>
        <li>Dislikes: {formatter(tooltip.get('dislikes'))}</li>
        <li>Temperature: {formatter(tooltip.get('temperature'))}</li>
        <li>Avg Temperature: {formatter(tooltip.get('avgTemperature'))}</li>
        <li>Sum Temperature: {formatter(tooltip.get('sumTemperature'))}</li>
        <li>Sentiment magnitude (Google): {ratioFormatter(tooltip.get('sentiment_magnitude'))}</li>
        <li>Sentiment score (Google): {ratioFormatter(tooltip.get('sentiment_score'))}</li>
        <li>Watson Tone (IBM): {tone}</li>
        <li>Faces API (Microsoft): {facesString}</li>
      </ul>
    );
  }

  renderSnake(t, i) {
    return (
      <div className={classes.col}>
        <div className={classes.innerCol}>
          <Snake
            index={i}
            tasks={t.reverse()}
            onMouseOver={this.onMouseOver.bind(this)}
            onMouseOut={this.onMouseOut.bind(this)}
            {...this.state}
          />
        </div>
      </div>
    );
  }

  renderGrid(t, i) {
    return (
      <div className={classes.col}>
        <div className={classes.innerCol}>
          <Grid
            index={i}
            tasks={t.reverse()}
            onMouseOver={this.onMouseOver.bind(this)}
            onMouseOut={this.onMouseOut.bind(this)}
            {...this.state}
          />
        </div>
      </div>
    );
  }

  renderPizza(t, i) {
    return (
      <div className={classes.col}>
        <div className={classes.innerCol}>
          <Pizza
            index={i}
            tasks={t.reverse()}
            onMouseOver={this.onMouseOver.bind(this)}
            onMouseOut={this.onMouseOut.bind(this)}
            {...this.state}
          />
        </div>
      </div>
    );
  }

  renderStack(t, i) {
    return (
      <div className={classes.col}>
        <div className={classes.innerCol}>
          <Stack
            index={i}
            tasks={t.reverse()}
            onMouseOver={this.onMouseOver.bind(this)}
            onMouseOut={this.onMouseOut.bind(this)}
            {...this.state}
          />
        </div>
      </div>
    );
  }

  render() {
    const { tasks, type } = this.props;
    const { tooltip } = this.state;

    const renderedTooltip = (tooltip) ? this.renderTooltip(tooltip) : null;

    let renderFn = this.renderSnake;

    if (type === 'grid') {
      renderFn = this.renderGrid;
    } else if (type === 'pizza') {
      renderFn = this.renderPizza;
    } else if (type === 'stack') {
      renderFn = this.renderStack;
    }

    return (
      <div
        ref={(el) => this.chart = el}
        className={classes.chart}
      >
        {tasks.map(renderFn.bind(this))}
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
