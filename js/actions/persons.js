
import QuizzrDispatch from "../dispatcher";


module.exports = {
    loadPersons:  function () {
        QuizzrDispatch.dispatch({ type: "load-persons" });
    }
};
