
import React from "react";
import ImageLoader from 'react-imageloader';

import Spinner from "../components/spinner.jsx";
import UserActions from "./actions/user";
import QuizzActions from "./actions/quizz";
import ScoreStore from "./stores/score";

import Details from "./details.jsx";

let utils = require("./utils");

export default class QuizzQuestion extends React.Component {
    constructor (props) {
        super(props);
        this.state = {answered: false};
    }

    componentDidMount () {
      ScoreStore.on("newquestion", this._newQuestion.bind(this));
    }
    componentWillUnmount () {
      ScoreStore.removeListener("newquestion", this._newQuestion.bind(this));

    }

    _pickAnswer (p) {
        return () => {
          if (this.state.answered) return;
          UserActions.pickAnswer(p);
          QuizzActions.scoreAnswer(p.id === this.props.person.id);
          this.setState({answered:p});
        }
    }

    _newQuestion () {
        this.setState({answered:false});
    }


    _showFilter(bool, trueClass, falseClass, baseClass = "")  {
       return baseClass + " " + (bool ? trueClass : falseClass);
    }


    render () {
        if (this.props.person === null) {
          return <Spinner/>
        } else {
        let profile = "";
        if (this.state.answered)  {
          profile = <Details object={this.props.person}/>;
        }
        let spinner = () => <Spinner/>;
        return <div className={"question" + (this.state.answered && this.state.answered.id === this.props.person.id ? " correct" : "")}>
          <div className="target">
            <ImageLoader preloader={spinner} src={this.props.person.pic} alt="Person to be guessed"/>
            {profile}
          </div>
          <div className="answer">
          <div className={"wrongtarget " + (this.state.answered && this.state.answered.id !== this.props.person.id ? "shown" : "hide")}>
            <img src={this.state.answered.pic || ""} alt={this.state.answered.name || ""}/>
          </div>
          <ul>
          {
          this.props.pool.map(
            (p,i) =>
                    <li key={i} className={(this.state.answered && this.state.answered.id === p.id ? "picked " : "") + (this.state.answered && p.id === this.props.person.id ? "right": (this.state.answered && p.id === this.state.answered.id ? "wrong" : (this.state.answered ? "other" : "")))}>
                    <button disabled={this.state.answered !== false} className={"pure-button pure-button-primary " + (this.state.answered && p.id === this.state.answered.id ? "picked " : " ") + (this.state.answered && p.id === this.props.person.id ? "button-success" : (this.state.answered ? "button-error" : ""))}
                    onClick={this._pickAnswer(p).bind(this)}>{p.name}</button>
                    </li>)
          }
          </ul>
          </div>
        </div>;
        }
    }
}
