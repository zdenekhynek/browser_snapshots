import React, { Component } from 'react';
import PropTypes from 'prop-types';
import sizeMe from 'react-sizeme';
import { NavLink } from 'react-router-dom';
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

import Profiles from '../desktop/profiles';
import SnakeChart from '../races/snake_chart';
import { setActiveMetric } from '../metrics/action_creators';

import classes from './highlight.css';
import backButtonClasses from '../races/back_button.css';

export const formatter = format(',');
export const ratioFormatter = format('.3f');


class Highlight extends Component {
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

  renderBackButton() {
    return (
      <div className={backButtonClasses.backButtonWrapper}>
        <NavLink className={backButtonClasses.backButton} to="/highlights">&lt; Back</NavLink>
      </div>
    );
  }

  render() {
    const {
      activeRace,
      metrics,
      tasks,
      noAnimation,
      size,
      showResults,
    } = this.props;
    const { data } = this.state;

    const backLink = `/viz/archive/`;

    const raceId = activeRace.get('id', 0);
    const raceName = activeRace.get('name', 'Race name');
    const raceKeyword = activeRace.get('keyword', 'keyword');

    const date = new Date(activeRace.get('created_at'));
    const raceDate = (raceId > -1) ?
      `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}` : '';

    let label = activeRace.get('label');
    if (raceId > -1) {
      label = `Profiles searched for "${raceKeyword}", clicked 
        first search result and then watch 10 videos which were recommended 
        for them by YouTube as the "Up Next" video.`;
    }

    const appendix = "These are the videos each profile saw.";

    //  get active metric
    const activeMetric = data.metric;

    //{gui}
    //  const gui = this.renderGui();

    const vizClassName = (showResults)? classes.vizResults : classes.viz;

    return (
      <div className={classes.raceChart}>
        <Profiles />
        <div className={classes.label}>
          <h2>{raceName}</h2>
          <h3>{label}</h3>
          <h4>{appendix}</h4>
        </div>
        <div className={vizClassName}>
          <SnakeChart
            raceId={raceId}
            type="tree"
            tasks={tasks}
            metric={activeMetric}
            noAnimation={noAnimation}
          />
        </div>
        {this.renderBackButton()}
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

export function mapStateToProps({ agents, metrics, races }, { raceId, noAnimation = true }) {
  const activeRace = races.find((r) => +r.get('id', '') === +raceId, null, Map());

  console.log('activeRace', activeRace);

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

Highlight.propTypes = {
  agents: PropTypes.object,
  tasks: PropTypes.object,
};

Highlight.defaultProps = {
  agents: List(),
  tasks: List(),
};


// Create the config
const config = { monitorHeight: true, monitorWidth: true };

// Call SizeMe with the config to get back the HOC.
const sizeMeHOC = sizeMe(config);

export default connect(mapStateToProps, { setActiveMetric })(sizeMeHOC(Highlight));
