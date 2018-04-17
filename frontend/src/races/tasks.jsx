import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';

export function renderAgentTasks(tasks, agent) {
  return (
    <div key={agent}>
      Agent: {agent}
      <ul>
        {tasks.map((task) => {
          return (
            <ol>{task.get('title')}</ol>
          );
        })}
      </ul>
    </div>
  );
}

const Tasks = ({ tasks }) => {
  return (
    <div style={{ display: "flex" }}>
      {tasks.map(renderAgentTasks)}
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
