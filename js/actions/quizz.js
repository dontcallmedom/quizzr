
import QuizzrDispatch from "../dispatcher";


module.exports = {
    newQuestion:  function () {
        QuizzrDispatch.dispatch({ type: "new-question" });
    },
    scoreAnswer: function(right) {
      QuizzrDispatch.dispatch({ type: "score-answer", right: right });
    }
};
