
import QuizzrDispatch from "../dispatcher";


module.exports = {
    newQuestion:  function (disconnected) {
        QuizzrDispatch.dispatch({ type: "new-question"});
    },
    newCandidate:  function (disconnected) {
        QuizzrDispatch.dispatch({ type: "new-candidate"});
    },
    scoreAnswer: function(right) {
      QuizzrDispatch.dispatch({ type: "score-answer", right: right });
    },
    switchOffline: function() {
      QuizzrDispatch.dispatch({ type: "switch-offline"});
    }
};
