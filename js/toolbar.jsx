
import React from "react";

import ScoreTracker from "./score.jsx";
import ScoreStore from "./stores/score";
import QuizzAction from "./actions/quizz";


export default class Toolbar extends React.Component {
    constructor (props) {
        super(props);
        this.state = {answered: false};
    }
    componentDidMount () {
        ScoreStore.on("scoreanswer", this._onAnswer.bind(this));
        ScoreStore.on("newquestion", this._onQuestion.bind(this));
    }
    componentWillUnmount () {
        ScoreStore.removeListener("scoreanswer", this._onAnswer.bind(this));
        ScoreStore.removeListener("newquestion", this._onQuestion.bind(this));
    }
    componentDidUpdate () {
        if (this.state.answered) {
          this.refs.next.getDOMNode().focus();
        }
    }

    _onAnswer () {
        this.setState({answered: true});
    }

    _onQuestion () {
        this.setState({answered: false});
    }

    _newQuestion () {
      QuizzAction.newQuestion();
    }

    render () {
        var className = "button-next pure-button" + (this.state.answered ? " pure-button-primary" : "");
        return <div className="toolbar">
              <button ref="next" className={className} disabled={!this.state.answered} onClick={this._newQuestion}>Next</button>
              <ScoreTracker/>
              </div> ;
    }
}
