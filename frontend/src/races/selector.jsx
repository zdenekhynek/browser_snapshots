import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';

import noop from '../utils/noop';

import classes from './selector.css';

class Selector extends Component {
  static renderOption(race) {
    const raceId = race.get('id');
    const raceKeyword = race.get('keyword');

    const label = (raceId > -1) ?
      `Videos about ${raceKeyword}` : race.get('label');

    return (
      <option key={raceId} value={raceId}>
        {label}
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

    const blankOption = Map({
      id: -1,
      label: '---select search or create new one below---',
    });
    const options = races.unshift(blankOption);

    return (
      <div className={classes.section}>
        <select
          className={classes.selector}
          value={selectedId}
          onChange={this.onChange}
        >
          {options.map(Selector.renderOption)}
        </select>
      </div>
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
