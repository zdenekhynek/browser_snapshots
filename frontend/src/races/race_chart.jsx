import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Map } from 'immutable';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { select, event } from 'd3-selection';
import { format } from 'd3-format';
import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import { axisLeft, axisBottom } from 'd3-axis';
import { min, max } from 'd3-array';
import DatGui, { DatSelect } from 'react-dat-gui';

import Chart, { COLORS } from './chart';
import RadialChart from './radial_chart';
import SnakeChart from './snake_chart';
import { setActiveMetric } from '../metrics/action_creators';

import classes from './race_chart.css';

export const formatter = format(',');
export const ratioFormatter = format('.3f');

export function renderMetricDropdownOption(metric) {
  return (
    <option key={metric.get('id')} value={metric.get('id')}>
      {metric.get('title')}
    </option>
  );
}

class RaceChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        package: 'react-dat-gui',
        metric: 'temperature',
      },
    };

    this.onGuiUpdate = this.onGuiUpdate.bind(this);
  }

  onGuiUpdate(data) {
    this.setState({ data });
  }

  renderGui() {
    const { data } = this.state;

    return (
      <DatGui data={data} onUpdate={this.onGuiUpdate}>
        <DatSelect
          path='metric'
          label='metric'
          options={['noise', 'pollution']}
        />
      </DatGui>
    );
  }

  render() {
    const { activeRace, metrics, tasks, noAnimation } = this.props;
    const { data } = this.state;

    const backLink = `/viz/archive/`;

    const raceId = activeRace.get('id');
    const raceKeyword = activeRace.get('keyword');

    const date = new Date(activeRace.get('created_at'));
    const raceDate = (raceId > -1) ?
      `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}` : '';

    const label = (raceId > -1) ?
      `Searched for ${raceKeyword}` : activeRace.get('label');

    //  get active metric
    const activeMetric = data.metric;

    //{gui}

    const gui = this.renderGui();

    return (
      <div className={classes.raceChart}>
        <h2>{label}</h2>
        <div className={classes.viz}>
          <SnakeChart
            raceId={raceId}
            type="tree"
            tasks={tasks}
            metric={activeMetric}
            noAnimation={noAnimation}
          />
        </div>
      </div>
    );
  }
}

export function sum(collection, key) {
  return collection.reduce((acc, x) => {
    if (!Number.isNaN(x.get(key))) {
      return acc + x.get(key);
    }

    return sum;
  }, 0);
}

export function mapStateToProps({ agents, metrics, races }, { raceId, noAnimation = false }) {
  const activeRace = races.find((r) => r.get('id', '') === +raceId, null, Map());

  const tasks = activeRace.get('tasks', List());
  const agentsIds = tasks.reduce((acc, d, i) => acc.push(i), List()).toJS();

  const raceAgents = agents.get('available', List()).filter((a) => {
    return agentsIds.includes(a.get('id'));
  });

  //  convert from id based orderedmap to normal list
  const flattenedTasks = tasks.reduce((acc, t) => {
    return acc.push(t);
  }, List());

  return {
    activeRace,
    agents: raceAgents,
    metrics,
    tasks: flattenedTasks,
    noAnimation,
  };
}

RaceChart.propTypes = {
  agents: PropTypes.object,
  tasks: PropTypes.object,
};

RaceChart.defaultProps = {
  agents: List(),
  tasks: List(),
};

export default connect(mapStateToProps, { setActiveMetric })(RaceChart);
