
import React from "react";
import { Link } from "react-router";

import OnlineStateStore from "./stores/onlinestate.js"


let utils = require("./utils")
,   pp = utils.pathPrefix()
;

export default class Menu extends React.Component {
    constructor (props) {
        super(props);
    }
    componentDidMount () {
    }
    componentWillUnmount () {
    }


    render () {
      var download = "";
      if (OnlineStateStore.getSWState()) {
        download = <MenuItem icon="cloud-download" target={pp + "download"} text="Download" selected={this.props.selected === "download"}/>;
      }
      return <nav className="pure-menu pure-menu-horizontal">
               <ul className="pure-menu-list">
                 <MenuItem icon="question" target={pp} text="Quizz" selected={this.props.selected === "quizz"}/>
                 {download}
               </ul>
             </nav> ;
    }
}

class MenuItem extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    var icon = <img src={"images/" + this.props.icon + ".svg"} alt={this.props.text}/>
    if (this.props.selected) {
      return <li className="pure-menu-selected pure-menu-item pure-menu-disabled">{icon}</li>;
    } else {
      return <li className="pure-menu-item"><Link to={this.props.target} className="pure-menu-link">{icon}</Link></li>;
    }
  }

}
