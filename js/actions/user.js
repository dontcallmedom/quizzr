
import QuizzrDispatch from "../dispatcher";

module.exports = {
    pickAnswer:  function (person) {
        QuizzrDispatch.dispatch({ type: "pick-answer", person: person });
    }
};
