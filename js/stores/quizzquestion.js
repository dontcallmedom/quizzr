
import WoozwuDispatch from "../dispatcher";
import assign from "object-assign";
import EventEmitter from "events";
import PersonStore from "./person.js"
const shuffle = require("shuffle-array");

let _target = null,
    _pool = [],
    QuestionStore = module.exports =  assign({}, EventEmitter.prototype, {
        emitChange: function () { this.emit("change"); }
    ,   addChangeListener: function (cb) { this.on("change", cb); }
    ,   removeChangeListener: function (cb) { this.removeListener("change", cb); }

    ,   getQuestion: function () {
            return {target: _target, pool: _pool};
        }
    })
;

const randomPick = a => { return a[Math.floor(Math.random() * a.length)]};
const removePicked = picked => { return p => p.hash !== picked.hash};

QuestionStore.dispatchToken = WoozwuDispatch.register((action) => {
    switch (action.type) {
        case "new-question":
        // Choose a pic randomly
        WoozwuDispatch.waitFor([PersonStore.dispatchToken]);
        _pool = [];
        let persons = PersonStore.getPersons();
        const personsWithPic = persons.filter(p => p.pic !== null);
        _target = randomPick(personsWithPic);
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
