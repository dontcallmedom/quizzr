
import QuizzrDispatch from "../dispatcher";


module.exports = {
    newQuestion:  function (disconnected) {
        QuizzrDispatch.dispatch({ type: "new-question", disconnected: disconnected || false });
    },
    scoreAnswer: function(right) {
      QuizzrDispatch.dispatch({ type: "score-answer", right: right });
    }
};
