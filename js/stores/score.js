
import WoozwuDispatch from "../dispatcher";
import assign from "object-assign";
import EventEmitter from "events";

let _total = 0,
    _right = 0,
    ScoreStore = module.exports =  assign({}, EventEmitter.prototype, {
        emitChange: function () { this.emit("change"); }
    ,   addChangeListener: function (cb) { this.on("change", cb); }
    ,   removeChangeListener: function (cb) { this.removeListener("change", cb); }

    ,   getScore: function () {
            return {total: _total, right: _right};
        }
    })
;

ScoreStore.dispatchToken = WoozwuDispatch.register((action) => {
    switch (action.type) {
        case "new-question":
        _total++;
        ScoreStore.emitChange();
        ScoreStore.emit("newquestion");
        break;
        case "score-answer":
        if (action.right) _right++;
        ScoreStore.emitChange();
        ScoreStore.emit("scoreanswer");
        break;
    }
});
