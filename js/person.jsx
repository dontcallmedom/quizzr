
import React from "react";

import PersonStore from "./stores/person";

export default class Toolbar extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            persons: PersonStore.getPersons()
        };
    }
    componentDidMount () {
        PersonStore.addChangeListener(this._onChange.bind(this));
    }
    componentWillUnmount () {
        PersonStore.removeChangeListener(this._onChange.bind(this));
    }
    _onChange () {
        this.setState({ persons: PersonStore.getPersons()});
    }

    render () {
        let st = this.state;
        return <ul>
          {
          st.persons.map(p => {
                if (p.pic)
                  return <img src={p.pic} alt={p.name}/>;
                else
                  return <span className="person">{p.name}</span>;
              })
          }
            </ul>
        ;
    }
}
