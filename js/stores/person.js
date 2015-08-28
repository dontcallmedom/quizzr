
import QuizzrDispatch from "../dispatcher";
import assign from "object-assign";
import EventEmitter from "events";
let config = require("../../config.json");

//  /!\  magically create a global fetch
require("isomorphic-fetch");

let utils = require("../utils")
,  _persons = []
,  _offlinePersons = []
,   PersonStore = module.exports =  assign({}, EventEmitter.prototype, {
        emitChange: function () { this.emit("change"); }
    ,   addChangeListener: function (cb) { this.on("change", cb); }
    ,   removeChangeListener: function (cb) { this.removeListener("change", cb); }

    ,   getPersons: function () {
            return _persons.filter(p => { return p.pic != null});
        }
    ,   getOfflinePersons: function () {
            return _offlinePersons;
        }
    })
;

PersonStore.dispatchToken = QuizzrDispatch.register((action) => {
    switch (action.type) {
        case "load-persons":
        fetch(config.personList)
             .then(utils.jsonHandler)
            .then(data => { _persons = data; PersonStore.emitChange();})
            .catch(utils.catchHandler);
        break;
        case 'switch-offline':
        case "list-offline-persons":
          if (!('serviceWorker' in navigator)) {
            _offlinePersons = [];
            PersonStore.emit('list-offline');
          }
          // let's ask our service worker for available pics
          utils.sendSWMessage({command:'gotpics'})
            .then(
              pics => {
                _offlinePersons = _persons.filter(
                  p => pics.indexOf(p.pic) >= 0
                );
                PersonStore.emit('list-offline');
              }
            );
        break;
    }
});
