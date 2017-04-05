import React, { Component } from 'react';
import firebase from 'firebase';
import _ from 'lodash';
import UserInfo from './UserInfo';
import '../css/MyStuff.css';

class MyStuff extends Component {
  constructor() {
    super();
    this.state = {
      userData: {},
      emailStarted: false,
      emailSent: false
    };
  }
  componentWillMount() {
    const user = firebase.auth().currentUser;
    firebase.database().ref('users/' + user.uid).on('value', snapshot => {
      this.setState({ userData: snapshot.val() });
    });
  }
  handleStateSelect(selectedState) {
    const user = firebase.auth().currentUser;
    if (this.state.userData.state !== selectedState) {
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
    if (_.isEmpty(this.state.userData)) {
      return (
        <div className="profile-page">loading...</div>
      );
    }
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
        <UserInfo
          userData={this.state.userData}
        />
        <div className="section email-section">
          <div className="section-title">Your Scheduled Emails</div>
        </div>
      </div>
      </div>
    );
  }
}

export default MyStuff;
