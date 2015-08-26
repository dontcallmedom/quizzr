
import React from "react";

import { Router, Route } from "react-router";
import BrowserHistory from "react-router/lib/BrowserHistory";

import Application from "../components/application.jsx";
import Spinner from "../components/spinner.jsx";
import QuizzQuestion from "./quizzquestion.jsx";
import Toolbar from "./toolbar.jsx";

import PersonList from "./person.jsx";

import QuizzActions from "./actions/quizz.js";
import QuestionStore from "./stores/quizzquestion";

import PersonsActions from "./actions/persons";
import PersonStore from "./stores/person";


let utils = require("./utils")
,   pp = utils.pathPrefix()
;

class WoozWu extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
          loaded: false,
          person: null,
          pool: []
        };
    }
    componentDidMount () {
        QuestionStore.addChangeListener(this._onChange.bind(this));
        PersonsActions.loadPersons();
        QuizzActions.newQuestion();
    }
    componentWillUnmount () {
        QuestionStore.removeChangeListener(this._onChange.bind(this));
    }
    _onChange () {
          var {target, pool} = QuestionStore.getQuestion();
          this.setState({loaded:true, person: target, pool: pool});
    }

    render () {
        let st = this.state;
        return <Application title="Who is this?">
                  <QuizzQuestion person={st.person} pool={st.pool}/>
                  <Toolbar/>
                </Application>
        ;
    }
}

React.render(
    <Router history={new BrowserHistory}>
        <Route path={pp} component={WoozWu}></Route>
    </Router>
,   document.body
);
