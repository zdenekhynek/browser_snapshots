/* global AGENTS_LIST */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Map, fromJS } from 'immutable';
import { withRouter } from 'react-router';

import noop from '../utils/noop';

import classes from './form.css';

export const AGENTS = {
  development: [
    { id: 1, name: 'Slavoj Krizala', email: 'slavoj.krizala@gmail.com' },
    { id: 7, name: 'Les Fauvy', email: 'les fauvy' },
    { id: 8, name: 'Catherine', email: 'catherine' },
  ],
  staging: [
    { id: 4, name: 'Donald Trump', email: 'boy.from.queens@gmail.com' },
    { id: 5, name: 'Gwyneth Paltrow', email: 'healthy.bunny.guru@gmail.com' },
    { id: 6, name: 'Julian Assange', email: 'transparency.hacker.pirate@gmail.com' },
  ],
};

class Form extends Component {
  static renderAgentDropdownOption(agent) {
    return (
      <option key={agent.get('id')} value={+agent.get('id')}>
        {agent.get('name')}
      </option>
    );
  }

  constructor(props) {
    super(props);

    const list = fromJS(AGENTS[AGENTS_LIST]);
    this.state = { keyword: '', currentAgents: list };

    this.onKeywordChange = this.onKeywordChange.bind(this);
    this.onAgentChange = this.onAgentChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onAddRacer = this.onAddRacer.bind(this);
  }

  onKeywordChange(evt) {
    this.setState({ keyword: evt.target.value });
  }

  onAgentChange(evt, i) {
    const { currentAgents } = this.state;
    const newId = +evt.target.value;
    const newAgents = currentAgents.update(i, (a) => a.set('id', newId));
    this.setState({ currentAgents: newAgents });
  }

  onSubmit(evt) {
    evt.preventDefault();
    const { history } = this.props;
    const { keyword, currentAgents } = this.state;
    const agentIds = currentAgents.map((a) => a.get('id'));
    this.props.onSubmit(keyword, agentIds, history);
  }

  onAddRacer(evt) {
    evt.preventDefault();
    const { currentAgents } = this.state;
    const newAgent = Map({ id: 0 });
    this.setState({ currentAgents: currentAgents.push(newAgent) });
  }

  onRemoveRacer(evt, index) {
    evt.preventDefault();
    const { currentAgents } = this.state;
    this.setState({ currentAgents: currentAgents.delete(index) });
  }

  renderAgentDropdown(agent, agents, i) {
    return (
      <div key={i}>
        <select
          className={classes.agents}
          value={agent.get('id')}
          onChange={(evt) => this.onAgentChange(evt, i)}
        >
          {agents.map(Form.renderAgentDropdownOption)}
        </select>
        <button
          className={classes.removeBtn}
          onClick={(evt) => this.onRemoveRacer(evt, i)}
        >
          x
        </button>
      </div>
    );
  }

  render() {
    const { currentAgents } = this.state;
    const { agents } = this.props;

    return (
      <form className={classes.form} onSubmit={this.onSubmit}>
        <div className={classes.section}>
          <div className={classes.agentsList}>
            {currentAgents.map((a, i) => this.renderAgentDropdown(a, agents, i))}
          </div>
          <button
            className={classes.addBtn}
            onClick={this.onAddRacer}
          >
            + Add profile
          </button>
        </div>

        <div className={classes.section}>
          <input
            type="text"
            value={this.state.value}
            onChange={this.onKeywordChange}
            placeholder="Type in keyword"
          />
          <button
            className={classes.searchBtn}
          >
            Search
          </button>
        </div>

      </form>
    );
  }
}

Form.propTypes = {
  agents: PropTypes.object,
  onSubmit: PropTypes.func,
};

Form.defaultProps = {
  agents: List(),
  onSubmit: noop,
};

export default withRouter(Form);
