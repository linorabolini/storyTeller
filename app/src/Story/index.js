import React from "react";
import "./Story.css";
import * as firebase from "firebase";
import { Glyphicon } from "react-bootstrap";
import showdown from "showdown";

const currentStory = 1;

class Story extends React.Component {
    componentWillMount() {
        this.setState({
            data: {}
        });

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRequestTurn = this.handleRequestTurn.bind(this);
        this.handleCancelTurn = this.handleCancelTurn.bind(this);
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

    handleRequestTurn() {
        firebase
            .database()
            .ref("stories/" + currentStory + "/turn")
            .set(this.props.profile.sub);
    }

    handleCancelTurn() {
        firebase
            .database()
            .ref("stories/" + currentStory + "/turn")
            .remove();
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

        this.handleCancelTurn();

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
        const canRequestTurn = !data.turn;
        const isAdmin = window.location.search.indexOf("admin") > 0;
        const paragraphs = Object.keys(data.paragraphs || {});
        const lastParagraph = [...paragraphs].pop();
        const lastName = lastParagraph && data.paragraphs[lastParagraph].user;
        const isCurrentUser = data.turn === this.props.profile.sub;
        const isLastCurrentUser = lastName === this.props.profile.sub;
        const converter = new showdown.Converter();
        const className =
            "Story " + (isLastCurrentUser ? "last-user" : "not-last-user");
        return (
            <div className={className}>
                {isAdmin && (
                    <pre>{JSON.stringify(this.state.data, null, 2)}</pre>
                )}
                <div className="Story-paragraphs">
                    {paragraphs.map((p, i) => {
                        const { user, text } = data.paragraphs[p];
                        const userProfile = this.props.users[user];
                        return (
                            <div key={i} className="row">
                                <div className="col-xs-3">
                                    <div className="profile">
                                        <div className="thumbnail">
                                            <img
                                                src={userProfile.picture}
                                                alt="..."
                                            />
                                        </div>
                                        <span className="name">
                                            {userProfile.name}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-xs-8">
                                    <div
                                        className="paragraph"
                                        dangerouslySetInnerHTML={{
                                            __html: converter.makeHtml(text)
                                        }}
                                    />
                                </div>
                                <div className="col-xs-1">
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
                </div>
                <br />
                <div className="row">
                    <div className="col-xs-3">
                        {!canRequestTurn &&
                            (isCurrentUser || isAdmin) && (
                                <div className="profile">
                                    <div className="thumbnail">
                                        <img src={profile.picture} alt="..." />
                                    </div>
                                    <span className="name">{profile.name}</span>
                                </div>
                            )}
                    </div>
                    <div className="col-xs-8">
                        {!isLastCurrentUser && (
                            <div>
                                {canRequestTurn && (
                                    <button
                                        style={{ width: "100%" }}
                                        type="button"
                                        className="btn btn-warning"
                                        onClick={() => this.handleRequestTurn()}
                                    >
                                        Pedir Turno <Glyphicon glyph="pencil" />
                                    </button>
                                )}
                                {!canRequestTurn &&
                                    (isCurrentUser || isAdmin) && (
                                        <form onSubmit={this.handleSubmit}>
                                            <textarea
                                                className="story-textarea"
                                                value={this.state.value}
                                                onChange={this.handleChange}
                                            />
                                            <div className="pull-left">
                                                <input
                                                    className="btn btn-success"
                                                    type="submit"
                                                    disabled={!this.state.value}
                                                    value="Publicar"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                className="btn btn-danger pull-right"
                                                onClick={() =>
                                                    this.handleCancelTurn()
                                                }
                                            >
                                                Cancelar Turno{" "}
                                                <Glyphicon glyph="ban-circle" />
                                            </button>
                                        </form>
                                    )}
                                {!canRequestTurn &&
                                    !isCurrentUser && (
                                        <div
                                            className="alert alert-info"
                                            role="alert"
                                        >
                                            <b>
                                                {
                                                    this.props.users[data.turn]
                                                        .name
                                                }
                                            </b>{" "}
                                            pidió el turno para escribir!
                                        </div>
                                    )}
                            </div>
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
