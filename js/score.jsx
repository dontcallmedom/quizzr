
import React from "react";
import ScoreStore from "./stores/score";

export default class ScoreTracker extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            total: 0,
            right: 0
        };
    }
    componentDidMount () {
      ScoreStore.addChangeListener(this._onChange.bind(this));
    }
    componentWillUnmount () {
      ScoreStore.removeChangeListener(this._onChange.bind(this));
    }

    _onChange () {
        this.setState(ScoreStore.getScore());
    }

    render () {
        let st = this.state;
        return <span className="score"><span className="right">{st.right}</span>
                {"/"}
                <span className="total">{st.total}</span></span> ;
    }
}
