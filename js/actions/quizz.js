
import WoozwuDispatch from "../dispatcher";


module.exports = {
    newQuestion:  function () {
        WoozwuDispatch.dispatch({ type: "new-question" });
    },
    scoreAnswer: function(right) {
      WoozwuDispatch.dispatch({ type: "score-answer", right: right });
    }
};
