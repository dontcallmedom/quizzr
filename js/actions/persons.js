
import WoozwuDispatch from "../dispatcher";


module.exports = {
    loadPersons:  function () {
        WoozwuDispatch.dispatch({ type: "load-persons" });
    }
};
