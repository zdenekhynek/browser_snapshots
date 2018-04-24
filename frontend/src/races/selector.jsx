import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';

import noop from '../utils/noop';

class Selector extends Component {
  static renderOption(race) {
    const raceId = race.get('id');

    return (
      <option key={raceId} value={raceId}>
        {raceId}
      </option>
    );
  }

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(evt) {
    this.props.onChange(+evt.target.value);
  }

  render() {
    const { races, selectedId } = this.props;

    const blankOption = Map({ id: '---select race or create new one---' });
    const options = races.unshift(blankOption);

    return (
      <select value={selectedId} onChange={this.onChange}>
        {options.map(Selector.renderOption)}
      </select>
    );
  }
}

Selector.propTypes = {
  races: PropTypes.object,
  selectedId: PropTypes.number,
  onChange: PropTypes.func,
};

Selector.defaultProps = {
  races: List(),
  selectedId: 0,
  onChange: noop,
};

export default Selector;
