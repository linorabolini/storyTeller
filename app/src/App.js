import React, { Component } from "react";
import { Navbar, Button } from "react-bootstrap";
import "./App.css";

class App extends Component {
    goTo(route) {
        this.props.history.replace(`/${route}`);
    }

    login() {
        this.props.auth.login();
    }

    logout() {
        this.props.auth.logout();
    }

    render() {
        const { isAuthenticated } = this.props.auth;

        return (
            <div>
                <Navbar>
                    <Button
                        bsStyle="default"
                        className="btn-margin"
                        onClick={this.goTo.bind(this, "home")}
                    >
                        Home
                    </Button>

                    {!isAuthenticated() && (
                        <Button
                            id="qsLoginBtn"
                            bsStyle="primary"
                            className="btn-margin pull-right"
                            onClick={this.login.bind(this)}
                        >
                            Log In
                        </Button>
                    )}
                    {isAuthenticated() && (
                        <Button
                            id="qsLogoutBtn"
                            bsStyle="primary"
                            className="btn-margin pull-right"
                            onClick={this.logout.bind(this)}
                        >
                            Log Out
                        </Button>
                    )}
                    {isAuthenticated() && (
                        <Button
                            bsStyle="warning"
                            className="btn-margin pull-right"
                            onClick={this.goTo.bind(this, "profile")}
                        >
                            Profile
                        </Button>
                    )}
                </Navbar>
            </div>
        );
    }
}

export default App;
