import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import states from '../data/stateList';
import '../css/StateDropdown.css';

const BOTTOM_MARGIN = 70;
const DEFAULT_HEIGHT = 50;

class StateDropdown extends Component {
  constructor() {
    super();
    this.state = {
      dropdownOpen: false
    };
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }
  componentDidMount() {
    window.addEventListener('click', this.handleOutsideClick);
  }
  componentWillUnmount() {
    window.removeEventListener('click', this.handleOutsideClick);
  }
  handleOutsideClick(e) {
    if (!ReactDOM.findDOMNode(this).contains(e.target)) {
      this.setState({ dropdownOpen: false });
    };
  }
  handleOptionClick(stateName) {
    this.props.onStateSelect(stateName);
    this.setState({ dropdownOpen: false });
  }
  render() {
    return (
      <div
        className="state-dropdown"
        ref={node => {if (node) this._bottom = node.getBoundingClientRect().bottom}}
      >
        <div
          className="state-box selected-state-box"
          onClick={() => this.setState({ dropdownOpen: !this.state.dropdownOpen })}
        >
          <div>{this.props.selectedState || 'select a state'}</div>
          <div className="arrow-down" />
        </div>
        {this.state.dropdownOpen && (
          <div
            className="options-container"
            style={{ height: window.innerHeight - this._bottom - BOTTOM_MARGIN || DEFAULT_HEIGHT }}
          >
            {states.map(state => (
              <div
                className="state-box state-option-box"
                key={state.abbreviation}
                onClick={() => this.handleOptionClick(state.name)}
              >
                {state.name}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

StateDropdown.propTypes = {
  selectedState: PropTypes.string,
  onStateSelect: PropTypes.func
};

export default StateDropdown;
