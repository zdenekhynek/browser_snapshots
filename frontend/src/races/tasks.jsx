import React from 'react';
import PropTypes from 'prop-types';
import { List, Map } from 'immutable';
import { format } from 'd3-format';
import { connect } from 'react-redux';

import { getVideoThumbnail } from './utils';

import classes from './tasks.css';

export function renderAgentTasks(tasks, agent, index) {
  const formatter = format(',');
  const ratioFormatter = format('.3f');
  const randomIndex = Math.round(Math.random() * 2);

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

            const url = task.get('url');
            const ytUrl = getVideoThumbnail(url);

            return (
              <a
                key={i}
                className={classes.task}
                href={task.get('url')}
                target="_blank"
              >
                <div>
                  <img src={ytUrl} className={classes.thumbnail} alt="" />
                </div>
                <div>
                  <h3>{task.get('title')}</h3>
                  <div className={classes.metric}>
                    <span>Views: {formatter(views)} </span>
                    <span>Likes: {formatter(likes)} </span>
                    <span>Dislikes: {formatter(dislikes)}</span>
                    <span>Ratio: {ratioFormatter(ratio)}</span>
                  </div>
                </div>
              </a>
            );
          })
        }
      </ul>
    </div>
  );
}

export class Tasks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
    };
  }

  componentDidMount() {
    //  DISABLED THUMBNAIL ROTATION
    // setInterval(() => {
    //   let { index } = this.state;
    //   if (index < 2) {
    //     index += 1;
    //   } else {
    //     index = 0;
    //   }

    //   this.setState({ index });
    // }, Math.random() * (5000 - 3000) + 3000 );
  }

  render() {
    const { agents, tasks } = this.props;
    const { index } = this.state;

    return (
      <div className={classes.tasks}>
        <div className={classes.lists}>
          {
            tasks.map((t, i) => {
              return renderAgentTasks(t.reverse(), agents.get(i), index);
            })
          }
        </div>
      </div>
    );
  }
}

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
