
import WoozwuDispatch from "../dispatcher";
import assign from "object-assign";
import EventEmitter from "events";


let _persons = {},
    PersonStore = module.exports =  assign({}, EventEmitter.prototype, {
        emitChange: function () { this.emit("change"); }
    ,   addChangeListener: function (cb) { this.on("change", cb); }
    ,   removeChangeListener: function (cb) { this.removeListener("change", cb); }

    ,   getPersons: function () {
            return _persons.filter(p => { return p.pic !== null}).map(p => p.name === "Doug Schepers" ? assign(p, {name:"Doug \"Werewolf\" Schepers"}) : p);
        }
    })
;

PersonStore.dispatchToken = WoozwuDispatch.register((action) => {
    switch (action.type) {
        case "load-persons":
        _persons = require("../../data/persons");
        PersonStore.emitChange();
        break;
    }
});
