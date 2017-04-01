import React, { Component } from 'react';
import firebase from 'firebase';
import StateDropdown from './StateDropdown';
import '../css/MyStuff.css';

class MyStuff extends Component {
  render() {
    const user = firebase.auth().currentUser;
    return (
      <div className="profile-page">
      <div className="top-section">
        <div className="top-section-icons">
          <span className="fa fa-envelope" />
          <span className="fa fa-plus" />
          <span className="fa fa-calendar-o" />
        </div>
        <div className="top-section-header">Your Stuff</div>
      </div>
      <div className="tiles-container">
        <div className="section info-section">
          <div className="section-title">Your Info</div>
          <div className="info-row">
            <div className="info-label">Your email:</div>
            <div className="info-value">
              {user.email} {user.emailVerified ? 'verified!' : '(click to verify)'}
            </div>
          </div>
          <div className="info-row">
            <div className="info-label">Your state:</div>
            <div className="info-value">
              <StateDropdown />
            </div>
          </div>
        </div>
        <div className="section email-section">
          <div className="section-title">Your Scheduled Emails</div>
        </div>
      </div>
      </div>
    );
  }
}

export default MyStuff;
