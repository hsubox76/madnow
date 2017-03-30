import React from 'react';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';

class Login extends React.Component {
  state = {
    formType: 'login',
    redirectToReferrer: false,
    error: null
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user && user.uid) {
        this.setState({ redirectToReferrer: true })
      }
    });
  }

  loginOrSignUp = (e) => {
    e.preventDefault();
    this.setState({ error: null });
    const email = this._emailAddress.value;
    const password = this._password.value;
    if (this.state.formType === 'login') {
      firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
        this.setState({ error })
      });
    } else {
      firebase.auth().createUserWithEmailAndPassword(email, password);
    }
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { redirectToReferrer } = this.state
    
    if (redirectToReferrer) {
      return (
        <Redirect to={from}/>
      )
    }
    
    return (
      <div className="login-page">
        <div className="login-form-title">
          {this.state.formType === 'login' ? 'Log In' : 'Create Account'}
        </div>
        {/* <p>You must log in to view the page at {from.pathname}</p> */}
        <form className="login-form" onSubmit={e => this.loginOrSignUp(e)}>
          <div
            className="login-form-switch-link"
            onClick={() =>
              this.setState({ formType: this.state.formType === 'login' ? 'signup' : 'login' })}
          >
            {this.state.formType === 'login'
              ? <div>
                  <span className="status-description">New?</span>
                  <span>Click here to create an account.</span>
                </div>
              : <div>
                  <span className="status-description">Already have an account?</span>
                  <span>Click here to sign in.</span>
                </div>}
          </div>
          <div className="form-row">
            <input
              className="username"
              type="email"
              ref={node => this._emailAddress = node}
              placeholder="email address"
            />
          </div>
          <div className="form-row">
            <input
              className="password"
              type="password"
              ref={node => this._password = node}
              placeholder="password"
            />
          </div>
          {this.state.error
            && <div className="login-error">
              {'Error: ' + this.state.error.message}
              </div>}
          <button className="button" onClick={this.loginOrSignUp}>
            {this.state.formType === 'login' ? 'log in' : 'create'}
          </button>
        </form>
      </div>
    )
  }
}

export default Login;
