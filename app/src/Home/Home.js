import React, { Component } from "react";
import Story from "../Story";
import * as firebase from "firebase";

class Home extends Component {
  componentWillMount() {
    this.setState({
      users: null,
      profile: null
    });

    var users = firebase.database().ref("users/");
    users.on("value", users => this.setState({ users: users.val() }));
    const { userProfile, getProfile } = this.props.auth;
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({ profile });
        // console.log(users);
        users.child(profile.sub).set(profile);
      });
    } else {
      this.setState({ profile: userProfile });
    }
  }
  login() {
    this.props.auth.login();
  }
  render() {
    const { isAuthenticated } = this.props.auth;
    return (
      <div className="container">
        {isAuthenticated() &&
          this.state.profile && (
            <Story
              {...this.props}
              profile={this.state.profile}
              users={this.state.users}
            />
          )}
        {!isAuthenticated() && (
          <h4>
            You are not logged in! Please{" "}
            <a style={{ cursor: "pointer" }} onClick={this.login.bind(this)}>
              Log In
            </a>{" "}
            to continue.
          </h4>
        )}
      </div>
    );
  }
}

export default Home;
