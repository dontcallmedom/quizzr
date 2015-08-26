
import React from "react";
import ImageLoader from 'react-imageloader';


import Spinner from "../components/spinner.jsx";
import UserActions from "./actions/user";
import QuizzActions from "./actions/quizz";
import ScoreStore from "./stores/score";


let utils = require("./utils");

const abbr = {"Web Applications":"WebApps",
              "Web Real-Time Communications": "WebRTC",
              "Web Application Security": "WebAppSec",
              "Cascading Style Sheet (CSS)": "CSS",
              "Web Cryptography": "WebCrypto",
              "Interest Group": "IG",
              "Working Group": "WG"};

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
          QuizzActions.scoreAnswer(p.hash === this.props.person.hash);
          this.setState({answered:p});
        }
    }

    _newQuestion () {
        this.setState({answered:false});
    }


    _showFilter(bool, trueClass, falseClass, baseClass = "")  {
       return baseClass + " " + (bool ? trueClass : falseClass);
    }

    _groupNames(groups) {
        if (groups.length === 0) return <span>None</span>;
        return this.props.person.groups.map(g => {
            var name = g;
            Object.keys(abbr).forEach(full => name = name.replace(full, abbr[full]));
            return <abbr title={g} key={name}>{name}, </abbr>}
        );
    }

    render () {
        if (this.props.person === null) {
        return <Spinner/>
        } else {
        let profile = "";
        let groups = this._groupNames(this.props.person.groups);
        if (this.state.answered)  {
          profile = <div className="profile">
                        <p>Member affiliation: {this.props.person.affiliation || "None"}</p>
                        <p>W3C groups participation: {groups}</p>
                      </div>;
        }
        let spinner = () => <Spinner/>;
        return <div className={"question" + (this.state.answered && this.state.answered.hash === this.props.person.hash ? " correct" : "")}>
          <div className="target">
            <ImageLoader preloader={spinner} src={this.props.person.pic} alt="Person to be guessed"/>
            {profile}
          </div>
          <div className="answer">
          <div className={"wrongtarget " + (this.state.answered && this.state.answered.hash !== this.props.person.hash ? "shown" : "hide")}>
            <img src={this.state.answered.pic || ""} alt={this.state.answered.name || ""}/>
          </div>
          <ul>
          {
          this.props.pool.map((p,i) => {
            return <li key={i} className={(this.state.answered && this.state.answered.hash === p.hash ? "picked " : "") + (this.state.answered && p.hash === this.props.person.hash ? "right": (this.state.answered && p.hash === this.state.answered.hash ? "wrong" : (this.state.answered ? "other" : "")))}>
                    <button disabled={this.state.answered !== false} className={"pure-button pure-button-primary " + (this.state.answered && p.hash === this.state.answered.hash ? "picked " : " ") + (this.state.answered && p.hash === this.props.person.hash ? "button-success" : (this.state.answered ? "button-error" : ""))}
                    onClick={this._pickAnswer(p).bind(this)}>{p.name}</button>
                  </li>;})
          }
          </ul>
          </div>
        </div>;
        }
    }
}
