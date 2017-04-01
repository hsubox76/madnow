import React, { Component } from 'react';
import states from '../data/stateList';
import '../css/StateDropdown.css';

class StateDropdown extends Component {
  constructor() {
    super();
    this.state = {
      dropdownOpen: false
    };
  }
  render() {
    return (
      <div className="state-dropdown">
        <div
          className="state-box selected-state-box"
          onClick={() => this.setState({ dropdownOpen: !this.state.dropdownOpen })}
        >
          <div>{this.props.selectedState || 'select a state'}</div>
          <div className="arrow-down" />
        </div>
        {this.state.dropdownOpen && (
          <div className="options-container">
            {states.map(state => (
              <div className="state-box state-option-box" key={state.abbreviation}>
                {state.name}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
} 

export default StateDropdown;
