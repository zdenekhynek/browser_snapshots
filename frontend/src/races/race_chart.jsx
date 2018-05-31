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

export function calculateRatio(d) {
  const likes = d.get('likes');
  const dislikes = d.get('dislikes');
  const total = likes + dislikes;
  //  1 should be if likes dislikes the same
  //  0 should be if one of them 0
  return 1 - Math.abs((likes - dislikes) / total);
}

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

  onMetricChange(evt) {
    this.props.setActiveMetric(evt.target.value);
  }

  onGuiUpdate(data) {
    this.setState({ data });
  }

  renderMetrics(metrics) {
    const activeMetric = metrics.find((m) => m.get('active', false));

    return (
      <div>
        <select
          value={activeMetric.get('id')}
          onChange={this.onMetricChange.bind(this)}
        >
          {metrics.map(renderMetricDropdownOption)}
        </select>
      </div>
    );
  }

  renderAgent(agent, i) {
    const totals = agent.get('totals');

    const backgroundColor = COLORS[i];
    const style = { backgroundColor };

    return (
      <li key={agent.get('name')} className={classes.agent} style={style}>
        <h3>{agent.get('name')}: {agent.get('gmail')}</h3>
        <ul>
          <li>Views: {formatter(totals.get('views'))}</li>
          <li>Likes: {formatter(totals.get('likes'))}</li>
          <li>Dislikes: {formatter(totals.get('dislikes'))}</li>
          <li>Ratio: {ratioFormatter(totals.get('ratio'))}</li>
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
    const { activeRace, metrics, tasks } = this.props;
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
    const activeMetric = data.metric;//  metrics.find((m) => m.get('active'), null, Map()).get('id');

    //  <Link className={classes.link} to={'/viz'}>Start a session</Link>
    //  <Link className={classes.link} to={backLink}>See the archive</Link>
    //  {this.renderMetrics(metrics)}
    //
    //  <SnakeChart
    //    type="mosaic"
    //    tasks={tasks}
    //    metric={data.metric}
    //  />
    //  <SnakeChart type="stack" tasks={tasks} metric={activeMetric} />
    //  <SnakeChart type="pizza" tasks={tasks} metric={activeMetric} />
    //  <SnakeChart type="grid" tasks={tasks} metric={activeMetric} />
    //  <SnakeChart tasks={tasks} metric={activeMetric} />
    //  <Chart tasks={tasks} />
    //  <RadialChart tasks={tasks} />
    //  {this.renderAgents()}

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

export function mapStateToProps({ agents, metrics, races }, { raceId }) {
  const activeRace = races.find((r) => r.get('id', '') === +raceId, null, Map());

  const tasks = activeRace.get('tasks', List());
  const agentsIds = tasks.reduce((acc, d, i) => acc.push(i), List()).toJS();

  let raceAgents = agents.get('available').filter((a) => {
    return agentsIds.includes(a.get('id'));
  });

  //  convert from id based orderedmap to normal list
  const flattenedTasks = tasks.reduce((acc, t) => {
    const newT = t.map((d) => d.set('ratio', calculateRatio(d)));

    //  want the oldest first
    const reversedTasks = newT;
    return acc.push(reversedTasks);
  }, List());

  const totals = flattenedTasks.map((t) => {
    const total = new Map({
      views: sum(t, 'views'),
      likes: sum(t, 'likes'),
      dislikes: sum(t, 'dislikes'),
      ratio: sum(t, 'ratio') / t.size,
    });
    return total;
  }, List());

  raceAgents = raceAgents.map((a, i) => {
    return a.set('totals', totals.get(i));
  });

  return {
    activeRace,
    agents: raceAgents,
    metrics,
    tasks: flattenedTasks,
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
