import React from 'react';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';

class Login extends React.Component {
  state = {
    redirectToReferrer: false
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user && user.uid) {
        this.setState({ redirectToReferrer: true })
      }
    });
  }

  login = () => {
    const email = 'hsubox@gmail.com';
    const password = 'testpassword';
    firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signUp = () => {
    const email = 'hsubox@gmail.com';
    const password = 'testpassword';
    firebase.auth().createUserWithEmailAndPassword(email, password);
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
      <div>
        <p>You must log in to view the page at {from.pathname}</p>
        <button onClick={this.login}>Log in</button>
        <button onClick={this.signUp}>Sign up</button>
      </div>
    )
  }
}

export default Login;
