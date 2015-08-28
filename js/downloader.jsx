import React from "react";

import QuestionStore from "./stores/quizzquestion";
import assign from "object-assign";
import PersonsActions from "./actions/persons";
import PersonStore from "./stores/person";


export default class Downloader extends React.Component {
  constructor (props) {
    super(props);
    this.state = {persons:PersonStore.getPersons().length, offlinePersons:0};
  }

  componentDidMount () {
    PersonStore.on("list-offline", this._onOffline.bind(this));
    PersonsActions.listOfflinePersons();
  }

  _updateState (obj) {
    this.setState(assign(this.state, obj));
  }

  _onOffline () {
    this._updateState({offlinePersons: PersonStore.getOfflinePersons().length});
  }


  render () {
    if (!('serviceWorker' in navigator)) {
      return <main><p>Sorry, your browser does not support offline.</p></main>;
    }
    return <main>
            <p>Number of questions: {this.state.persons}</p>
            <p>Number of questions available for offline usage: {this.state.offlinePersons}</p>
            <button className="pure-button pure-button-primary" disabled={this.state.persons === this.state.offlinePersons} onClick={PersonsActions.loadPersonsForOffline}>Download all questions for offline usage</button>
           </main>;
  }
}
