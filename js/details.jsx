import React from "react";

var Details = React.createClass({
  _renderObj: function (name, obj, wrapper) {
    if (obj === null || obj === undefined) return;
    if (typeof(obj) === "object") {
      const title = <h2>{name}</h2>;
      const content = <ul>{Object.keys(obj).map(o => this._renderObj(o, obj[o], "li"))}</ul>;
      return React.createElement(wrapper, {key:name}, [title, content]);
    } else if (typeof(obj) === "string" || typeof(obj) === "number") {
      return React.createElement(wrapper, {key:name}, name + ": " + obj);
    }
  },

  render: function () {
    if (!__renderDOMDetails) {
      var fields = Object.keys(this.props.object).filter( p => !(p === "id" || p === "pic" || p === "name"));
      return <div className="details">
          {fields.map(
            f => this._renderObj(f, this.props.object[f], "div")
          )}
        </div>;
      } else {
        console.log(__renderDOMDetails(this.props.object));
        return <div className="details" dangerouslySetInnerHTML={{__html: __renderDOMDetails(this.props.object)}}></div>
      }
  }
});

export default Details;
