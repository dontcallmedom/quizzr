
import QuizzrDispatch from "../dispatcher";


module.exports = {
    loadPersons:  function () {
        QuizzrDispatch.dispatch({ type: "load-persons" });
    },
    listOfflinePersons:  function () {
        QuizzrDispatch.dispatch({ type: "list-offline-persons" });
    },
    loadPersonsForOffline: function() {
        QuizzrDispatch.dispatch({ type: "load-persons-for-offline" });
    }
};
