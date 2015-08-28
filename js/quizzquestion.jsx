
import React from "react";
import ImageLoader from 'react-imageloader';

import Spinner from "../components/spinner.jsx";
import UserActions from "./actions/user";
import QuizzActions from "./actions/quizz";

import assign from "object-assign";

import Details from "./details.jsx";

let utils = require("./utils");

export default class QuizzQuestion extends React.Component {
    constructor (props) {
        super(props);
        this.state = {answered: false, failure: 0};
    }

    componentWillReceiveProps() {
      this._setAnswer(false);
    }

    _pickAnswer (p) {
        return () => {
          if (this.state.answered) return;
          UserActions.pickAnswer(p);
          QuizzActions.scoreAnswer(p.id === this.props.person.id);
          this._setAnswer(p);
        }
    }

    _setAnswer(a) {
      this._updateState("answered", a);
    }

    _updateState (name, val) {
      var obj = {};
      obj[name] = val;
      this.setState(assign(this.state, obj));
    }

    _showFilter(bool, trueClass, falseClass, baseClass = "")  {
       return baseClass + " " + (bool ? trueClass : falseClass);
    }

    _imageFailure() {
      this._updateState("failure", this.state.failure + 1);
      if (this.state.failure > 2) {
        QuizzActions.switchOffline();
      }
      QuizzActions.newCandidate();
    }

    render () {
        if (this.props.person == null) {
          return <Spinner/>
        } else {
        let profile = "";
        if (this.state.answered)  {
          profile = <Details object={this.props.person}/>;
        }
        let spinner = () => <Spinner/>;
        return <div className={"question" + (this.state.answered && this.state.answered.id === this.props.person.id ? " correct" : "")}>
          <div className="target">
            <ImageLoader onError={this._imageFailure.bind(this)} preloader={spinner} src={this.props.person.pic} alt="Person to be guessed"/>
            {profile}
          </div>
          <div className="answer">
          <div className={"wrongtarget " + (this.state.answered && this.state.answered.id !== this.props.person.id ? "shown" : "hide")}>
            <ImageLoader src={this.state.answered.pic || ""} alt={this.state.answered.name || ""}>Picture of {this.state.answered.name} unavailable</ImageLoader>
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
