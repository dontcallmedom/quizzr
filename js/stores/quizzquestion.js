
import QuizzrDispatch from "../dispatcher";
import assign from "object-assign";
import EventEmitter from "events";
import PersonStore from "./person.js"
import OnlineStateStore from "./onlinestate.js"


const shuffle = require("shuffle-array");

let _target = null,
    _pool = [],
    utils = require("../utils"),
    QuestionStore = module.exports =  assign({}, EventEmitter.prototype, {
        emitChange: function () { this.emit("change"); }
    ,   addChangeListener: function (cb) { this.on("change", cb); }
    ,   removeChangeListener: function (cb) { this.removeListener("change", cb); }

    ,   getQuestion: function () {
            return {target: _target, pool: _pool};
        }
    })
;

const randomPick = a => a[Math.floor(Math.random() * a.length)];
const removePicked = picked => { return p => p.id !== picked.id;};

QuestionStore.dispatchToken = QuizzrDispatch.register((action) => {
    switch (action.type) {
        case "new-question":
        case "new-candidate":
        // Choose a pic randomly
        QuizzrDispatch.waitFor([PersonStore.dispatchToken, OnlineStateStore.dispatchToken]);
        _pool = [];
        let persons = PersonStore.getPersons();
        if (!OnlineStateStore.getOnlineState()) {
          persons = PersonStore.getOfflinePersons();
        }
        _target = randomPick(persons);
        let picked = _target;
        _pool.push(picked);
        // Choose 3 names from different persons randomly
        for (let i = 0 ; i < 3 ; i++) {
          persons = persons.filter(removePicked(picked));
          picked = randomPick(persons);
          _pool.push(picked);
        }
        shuffle(_pool);
        QuestionStore.emitChange();
        break;
    }
});
