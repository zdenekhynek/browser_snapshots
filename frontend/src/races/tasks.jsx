import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { format } from 'd3-format';

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

const Tasks = ({ tasks }) => {
  return (
    <div className={classes.tasks}>
      <h3>Race videos</h3>
      <div className={classes.lists}>
        {tasks.map(renderAgentTasks)}
      </div>
    </div>
  );
};

Tasks.propTypes = {
  tasks: PropTypes.object,
};

Tasks.defaultProps = {
  tasks: List(),
};

export default Tasks;
