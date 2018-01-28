import React from "react";
import "./Story.css";
import * as firebase from "firebase";
import { Glyphicon } from "react-bootstrap";

const currentStory = 1;

class Story extends React.Component {
    componentWillMount() {
        this.setState({
            data: {}
        });

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        firebase
            .database()
            .ref("stories/" + currentStory)
            .on("value", data => this.setState({ data: data.val() }));
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();

        const p = firebase
            .database()
            .ref("stories/" + currentStory + "/paragraphs")
            .push();

        p.set({
            user: this.props.profile.sub,
            text: this.state.value
        });

        this.setState({ value: "" });
    }

    removeParagraph(id) {
        firebase
            .database()
            .ref("stories/" + currentStory + "/paragraphs/" + id)
            .remove();
    }
    render() {
        const { profile } = this.props;
        const data = this.state.data || {};
        const isAdmin = window.location.search.indexOf("admin") > 0;
        const paragraphs = Object.keys(data.paragraphs || {});
        const lastParagraph = [...paragraphs].pop();
        const lastName = lastParagraph && data.paragraphs[lastParagraph].user;
        const isLastCurrentUser = lastName === this.props.profile.sub;
        return (
            <div className="Story">
                {isAdmin && (
                    <pre>{JSON.stringify(this.state.data, null, 2)}</pre>
                )}
                {paragraphs.map((p, i) => {
                    const { user, text } = data.paragraphs[p];
                    const userProfile = this.props.users[user];
                    return (
                        <div key={i} className="row">
                            <div className="col-xs-2">
                                <div className="thumbnail">
                                    <img src={userProfile.picture} alt="..." />
                                </div>
                                <span>{userProfile.name}</span>
                            </div>
                            <div className="col-xs-8">
                                <p className="paragraph">{text}</p>
                            </div>
                            <div className="col-xs-2">
                                {isAdmin && (
                                    <p style={{ paddingTop: "3px" }}>
                                        <div
                                            className="btn-group btn-group-xs"
                                            role="group"
                                        >
                                            <button
                                                type="button"
                                                className="btn btn-warning"
                                                onClick={() =>
                                                    this.removeParagraph(p)
                                                }
                                            >
                                                <Glyphicon glyph="trash" />
                                            </button>
                                        </div>
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
                <div className="row">
                    <div className="col-xs-2">
                        <div className="thumbnail">
                            <img src={profile.picture} alt="..." />
                        </div>
                        <span>{profile.name}</span>
                    </div>
                    <div className="col-xs-8">
                        {!isLastCurrentUser && (
                            <form onSubmit={this.handleSubmit}>
                                <textarea
                                    className="story-textarea"
                                    value={this.state.value}
                                    onChange={this.handleChange}
                                />
                                {this.state.value && (
                                    <div className="text-align-right">
                                        <input
                                            className="btn btn-success"
                                            type="submit"
                                            value="Submit"
                                        />
                                    </div>
                                )}
                            </form>
                        )}
                        {isLastCurrentUser && (
                            <div className="alert alert-warning" role="alert">
                                <b>Hey! </b>
                                No puedes escribir 2 veces seguidas !
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default Story;
