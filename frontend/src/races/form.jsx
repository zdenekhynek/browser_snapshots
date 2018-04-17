import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Map } from 'immutable';

import noop from '../utils/noop';

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

    this.state = { keyword: '', currentAgents: List() };

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
    const { keyword, currentAgents } = this.state;
    const agentIds = currentAgents.map((a) => a.get('id'));
    this.props.onSubmit(keyword, agentIds);
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
          value={agent.get('id')}
          onChange={(evt) => this.onAgentChange(evt, i)}
        >
          {agents.map(Form.renderAgentDropdownOption)}
        </select>
        <button onClick={(evt) => this.onRemoveRacer(evt, i)}>X</button>
      </div>
    );
  }

  render() {
    const { currentAgents } = this.state;
    const { agents } = this.props;

    return (
      <form onSubmit={this.onSubmit}>
        <input
          type="text"
          value={this.state.value}
          onChange={this.onKeywordChange}
        />

        <div>
          {currentAgents.map((a, i) => this.renderAgentDropdown(a, agents, i))}
          <button onClick={this.onAddRacer}>Add racer</button>
        </div>

        <button>Search</button>
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

export default Form;
