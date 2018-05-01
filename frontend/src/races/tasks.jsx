import React from 'react';
import PropTypes from 'prop-types';
import { List, Map } from 'immutable';
import { format } from 'd3-format';
import { connect } from 'react-redux';

import classes from './tasks.css';

export function renderAgentTasks(tasks, agent) {
  const formatter = format(',');
  const ratioFormatter = format('.3f');

  return (
    <div key={agent.get('id')}>
      <h3>{agent.get('name')}: {agent.get('gmail')}</h3>
      <ul>
        {
          tasks.map((task, i) => {
            const views = task.get('views');
            const likes = task.get('likes');
            const dislikes = task.get('dislikes');
            const total = likes + dislikes;
            const ratio = likes / total;

            return (
              <ol key={i} className={classes.task}>
                <a href={task.get('url')} target="_blank">
                  {task.get('title')}
                </a>
                <div className={classes.metric}>
                  <span>Views: {formatter(views)} </span>
                  <span>Likes: {formatter(likes)} </span>
                  <span>Dislikes: {formatter(dislikes)}</span>
                  <span>Ratio: {ratioFormatter(ratio)}</span>
                </div>
              </ol>
            );
          })
        }
      </ul>
    </div>
  );
}

const Tasks = ({ agents, tasks }) => {
  return (
    <div className={classes.tasks}>
      <h3>Race tasks</h3>
      <div className={classes.lists}>
        {
          tasks.map((t, i) => {
            return renderAgentTasks(t, agents.get(i));
          })
        }
      </div>
    </div>
  );
};

export function mapStateToProps({ agents, races }) {
  const activeRace = races.find((r) => r.get('isActive', false), null, Map());
  const tasks = activeRace.get('tasks', List());
  const agentsIds = tasks.reduce((acc, d, i) => acc.push(i), List()).toJS();

  const raceAgents = agents.get('available').filter((a) => {
    return agentsIds.includes(a.get('id'));
  });
  const flattenedTasks = tasks.reduce((acc, t) => {
    return acc.push(t);
  }, List());

  return {
    agents: raceAgents,
    tasks: flattenedTasks,
  };
}

Tasks.propTypes = {
  agents: PropTypes.object,
  tasks: PropTypes.object,
};

Tasks.defaultProps = {
  agents: List(),
  tasks: List(),
};

export default connect(mapStateToProps)(Tasks);
