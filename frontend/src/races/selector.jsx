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
    const { races } = this.props;

    const blankOption = Map({ id: '---select race or create new one---' });
    const options = races.unshift(blankOption);

    return (
      <select onChange={this.onChange}>
        {options.map(Selector.renderOption)}
      </select>
    );
  }
}

Selector.propTypes = {
  races: PropTypes.object,
  onChange: PropTypes.func,
};

Selector.defaultProps = {
  races: List(),
  onChange: noop,
};

export default Selector;
