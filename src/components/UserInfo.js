import React, { Component, PropTypes } from 'react';
import firebase from 'firebase';
import _ from 'lodash';
import StateDropdown from './StateDropdown';
import '../css/UserInfo.css';

class UserInfo extends Component {
  constructor() {
    super();
    this.state = {
      emailStarted: false,
      emailSent: false
    };
  }
  handleStateSelect(selectedState) {
    const user = firebase.auth().currentUser;
    if (this.props.userData.state !== selectedState) {
      firebase.database().ref('users/' + user.uid + '/state')
        .set(selectedState);
    }
  }
  handleVerificationClick() {
    this.setState({emailStarted: true})
    const user = firebase.auth().currentUser;
    user.sendEmailVerification().then(() => this.setState({emailSent: true}));
  }
  render() {
    const user = firebase.auth().currentUser;
    return (
      <div className="section info-section">
        <div className="section-title">Your Info</div>
        <div className="info-row">
          <div className="info-label">Your email:</div>
          <div className="info-value">
            <div className="email-line">
            <span className="user-email">{user.email}</span>
              {user.emailVerified
                ? (
                  <div className="email-verified">
                    <span className="fa fa-check-circle" />
                      <span>verified!</span>
                  </div>)
                : (
                  <div className="email-not-verified">
                    <span className="fa fa-warning" />
                    <span>email not verified!</span>
                  </div>)}
            </div>
              {!user.emailVerified && !this.state.emailSent && !this.state.emailStarted && (
                <div className="email-warning-line">
                  <span
                    className="verify-link"
                    onClick={() => this.handleVerificationClick()}
                  >
                    click to send another verification email
                  </span>
                </div>
              )}
              {!user.emailVerified && !this.state.emailSent && this.state.emailStarted && (
                <div className="email-warning-line">
                  <span>sending...</span>
                </div>
              )}
              {!user.emailVerified && this.state.emailSent && (
                <div className="email-warning-line">
                  <span>new verification email sent!</span>
                  <span
                    className="verify-link try-again"
                    onClick={() => this.handleVerificationClick()}
                  >
                    send again?
                  </span>
                </div>
              )}
          </div>
        </div>
        <div className="info-row">
          <div className="info-label">Your state:</div>
          <div className="info-value">
            <StateDropdown
              selectedState={this.props.userData.state}
              onStateSelect={selectedState => this.handleStateSelect(selectedState)}
            />
          </div>
        </div>
      </div>
    );
  }
}

UserInfo.propTypes = {
  userData: PropTypes.object
}

export default UserInfo;
