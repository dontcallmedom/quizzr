
import QuizzrDispatch from "../dispatcher";
import assign from "object-assign";
import EventEmitter from "events";
import PersonStore from "./person.js"

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
        // Choose a pic randomly
        QuizzrDispatch.waitFor([PersonStore.dispatchToken]);
        _pool = [];
        let persons = PersonStore.getPersons();
        const personsWithPicPromise = new Promise((res, rej) => {
          if (action.disconnected && 'serviceWorker' in navigator) {
            // let's ask our service worker for available pics
            navigator.serviceWorker.ready.then(
              () => utils.sendSWMessage('gotpics')
            ).then(
              pics => {
                res(persons.filter(
                  p => pics.indexOf(p.pic) >= 0
                ));
              }
            )
            .catch(console.error.bind(console));
          } else {
            res(persons.filter(p => p.pic != null));
          }
        });
        personsWithPicPromise.then((personsWithPic) => {
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
        });
        break;
    }
});
