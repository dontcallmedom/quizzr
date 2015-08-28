
import React from "react";

import { Route, Router  } from "react-router";
import BrowserHistory from "react-router/lib/BrowserHistory";

import Spinner from "../components/spinner.jsx";
import QuizzQuestion from "./quizzquestion.jsx";
import Toolbar from "./toolbar.jsx";
import Menu from "./menu.jsx";

import QuizzActions from "./actions/quizz.js";
import QuestionStore from "./stores/quizzquestion";

import PersonsActions from "./actions/persons";
import PersonStore from "./stores/person";

let utils = require("./utils")
,   pp = utils.pathPrefix()
;

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      loaded: false,
      person: null,
      pool: []
    };

  }

  componentDidMount () {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(pp +'serviceworker.js')
        .then(function(registration) {
        })
        .catch(function(err) {
         console.error('ServiceWorker registration failed: ', err);
       });
    }
    QuestionStore.addChangeListener(this._onChange.bind(this));
    PersonStore.addChangeListener(this._onLoad.bind(this));
    PersonsActions.loadPersons();
  }

  componentWillUnmount () {
      QuestionStore.removeChangeListener(this._onChange.bind(this));
      PersonStore.removeChangeListener(this._onLoad.bind(this));
  }

  _onLoad () {
    QuizzActions.newQuestion();
  }

  _onChange () {
        var {target, pool} = QuestionStore.getQuestion();
        this.setState({loaded:true, person: target, pool: pool});
  }


  render () {
    var body = this.props.children;
    // There ought to be a better way to set props on children??!
    if (!this.props.children.props.route.name || this.props.children.props.route.name === "quizz") {
       var body = <Quizzr loaded={this.state.loaded} person={this.state.person} pool={this.state.pool}/>
    }
    return <main>
            <Menu selected={this.props.children.props.route.name || "quizz"}/>
            {body}
           </main>;
  }

}

class Quizzr extends React.Component {
    constructor (props) {
        super(props);

    }
    render () {
        var body;
        if (!this.props.loaded) {
          body = <Spinner/>;
        } else {
          body = <QuizzQuestion person={this.props.person} pool={this.props.pool}/>;
        }
        return  <div>
                  {body}
                  <Toolbar/>
                 </div>
        ;
    }
}

class Download extends React.Component {
  constructor (props) {
    super(props);
  }
  render () {
    return <main></main>;
  }
}

React.render(
    <Router history={new BrowserHistory} path={pp}>
        <Route name="quizz" path={pp} component={App} indexRoute={{component:Quizzr}}>
          <Route name="download" path="download" component={Download}/>
        </Route>
    </Router>
,   document.body
);
