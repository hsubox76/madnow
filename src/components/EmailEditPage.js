import React, { Component } from 'react';
import '../css/EmailEditPage.css';
import _ from 'lodash';
import firebase from 'firebase';
import { Link } from 'react-router-dom';
import { utc } from 'moment';

const MAX_EMAIL_TITLE_LENGTH = 50;

class EmailEditPage extends Component {
  constructor(props) {
    super(props);
    const params = props.location.search
      .slice(1)
      .split('&')
      .reduce((obj, pair) => {
        const parts = pair.split('=');
        obj[parts[0]] = parts[1];
        return obj;
      }, {});
    this.state = {
      userData: {},
      email: null,
      emailId: params.emailId,
      emailTitleValue: '',
      emailTextAreaValue: ''
    };
  }
  componentDidMount() {
    const user = firebase.auth().currentUser;
    firebase.database().ref('users/' + user.uid)
      .on('value', snapshot => {
        const emails = snapshot.val().emails || {};
        const emailFromParam = emails[this.state.emailId] || null;
        this.setState({
          userId: user.uid,
          userData: snapshot.val(),
          email: emailFromParam,
          emailTextAreaValue: _.get(emailFromParam, 'text') || '',
          emailTitleValue: _.get(emailFromParam, 'title') || ''
        });
      });
  }
  componentWillUnmount() {
    if (this.state.userId) {
      firebase.database().ref('users/' + this.state.userId).off();
    }
  }
  handleFormSubmit(e) {
    e.preventDefault();
    const user = firebase.auth().currentUser;
    const rawContent = this.state.emailTextAreaValue;
    if (!rawContent) {
      // should have an error message
      return;
    }
    const rawTitle = this.state.emailTitleValue
      || _.truncate(rawContent, {
          'length': MAX_EMAIL_TITLE_LENGTH,
          'separator': ' '
        });;
    const utcNow = utc().format();
    if (this.state.email) {
      firebase.database()
        .ref('users/' + user.uid + '/emails/' + this.state.emailId)
        .update({
          text: rawContent,
          title: rawTitle,
          updatedAt: utcNow
        })
        .then(() => this.props.history.push('/mystuff'))
        .catch(error => this.setState({ error }));
    } else {
      firebase.database()
        .ref('users/' + user.uid + '/emails')
        .push({
          text: rawContent,
          title: rawTitle,
          createdAt: utcNow,
          updatedAt: utcNow
        })
        .then(() => this.props.history.push('/mystuff'))
        .catch(error => this.setState({ error }));
    }
  }
  render() {
    const user = firebase.auth().currentUser;
    if (_.isEmpty(this.state.userData)) {
      return <div>loading...</div>;
    }
    const state = this.state.userData.state || 'your state';
    return (
      <div className="email-edit-page">
        <div className="banner-area">
          <h3>{this.state.emailId === 'new' ? "Write Yourself An Email" : "Edit An Email"}</h3>
        </div>
        <div className="info-area">
          <p>The message you write will be sent to you
          at <span className="user-email">{user.email}</span>:</p>
          <ul>
            <li>before the voter registration deadlines for {state}</li>
            <li>and again before the next election day in {state}</li>
          </ul>
          <p><Link to="/mystuff">Click here to change your email or state</Link></p>
        </div>
        <div className="editing-area">
          <form className="editing-form" onSubmit={(e) => this.handleFormSubmit(e)}>
            <label>Description</label>
            <input
              maxLength={MAX_EMAIL_TITLE_LENGTH}
              className="email-title"
              placeholder="A short description of your message"
              value={this.state.emailTitleValue}
              type="text"
              onChange={(e) => this.setState({ emailTitleValue: e.target.value })}
            />
            <label>Your Message</label>
            <textarea
              className="email-content"
              placeholder="Start typing a new email to yourself here."
              value={this.state.emailTextAreaValue}
              onChange={(e) => this.setState({ emailTextAreaValue: e.target.value })}
            />
            <div className="button-container">
              <button className="button">Save Email</button>
              <Link className="button cancel-button" to="/mystuff">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default EmailEditPage;