import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom'
import firebase from 'firebase';
import Login from './components/Login';
import './App.css';

const AuthButton = withRouter((props) => (
  props.user.uid ? (
    <div>
      Welcome! <button onClick={() => {
        firebase.auth().signOut().then(() => props.history.push('/'))
      }}>Sign out</button>
    </div>
  ) : (
    <ul><Link to="/login">Sign In</Link></ul>
  )
));

const Main = () => (
  <div>
    <h3>But I'm Mad Now</h3>
    <div>information about the site</div>
  </div>
);
const Protected = () => <h3>Protected</h3>

const PrivateRoute = ({ component, user, ...rest }) => {
  console.log('private route user', user && user.uid);
  return (
    <Route {...rest} render={props => {
      const redirectTo = { pathname: '/login', state: { from: props.location } };
      return (
        user.uid ? (
          React.createElement(component, props)
        ) : (
          <Redirect to={redirectTo} />
        )
    )}}/>
  );
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: 'loading'
    };
  }
  componentWillMount() {
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyCSj05BY6CBUfzsFE1RId7ftrAaYWGfegY",
      authDomain: "but-im-mad-now.firebaseapp.com",
      databaseURL: "https://but-im-mad-now.firebaseio.com",
      storageBucket: "but-im-mad-now.appspot.com",
      messagingSenderId: "318792884456"
    };
    firebase.initializeApp(config);
    const self = this;
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        self.setState({ user });
      } else {
        self.setState({ user: 'notloggedin' });
      }
    });
  }
  render() {
    return (
      <Router>
        <div className="App">
          <div className="navbar">
            <ul>
              <li><Link to="/main">Main</Link></li>
              <li><Link to="/protected">Protected Page</Link></li>
            </ul>
            <AuthButton user={this.state.user} />
          </div>
          <Route path="/" exact={true} component={Main}/>
          <Route path="/main" component={Main}/>
          <Route path="/login" render={(props) => <Login {...props} user={this.state.user} />}/>
          <PrivateRoute path="/protected" user={this.state.user} component={Protected}/>
        </div>
      </Router>
    );
  }
}

export default App;
