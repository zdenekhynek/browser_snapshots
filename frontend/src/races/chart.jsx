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
    <div key={agent}>
      Agent: {agent}
      <ul>
        {tasks.map((task, i) => {
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
        })}
      </ul>
    </div>
  );
}

const Chart = ({ tasks }) => {
  console.log('tasks', tasks);
  return (
    <div className={classes.tasks}>
      <h3>Race chart</h3>
      <div className={classes.lists}>
        {tasks.map(renderAgentTasks)}
      </div>
    </div>
  );
};

export function mapStateToProps({ agents, races }) {
  const activeRace = races.find((r) => r.get('isActive', false), null, Map());
  const tasks = activeRace.get('tasks', List());

  return {
    tasks,
  };
}

Chart.propTypes = {
  tasks: PropTypes.object,
};

Chart.defaultProps = {
  tasks: List(),
};

export default connect(mapStateToProps)(Chart);
