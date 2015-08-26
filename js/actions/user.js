
import WoozwuDispatch from "../dispatcher";

module.exports = {
    pickAnswer:  function (person) {
        WoozwuDispatch.dispatch({ type: "pick-answer", person: person });
    }
};
