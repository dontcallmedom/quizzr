import QuizzrDispatch from "../dispatcher";
import assign from "object-assign";
import EventEmitter from "events";

let _onlineState = true,
     OnlineStateStore = module.exports =  assign({}, EventEmitter.prototype, {
       emitChange: function () { this.emit("change"); }
   ,   addChangeListener: function (cb) { this.on("change", cb); }
   ,   removeChangeListener: function (cb) { this.removeListener("change", cb); }
   ,   getOnlineState: () => _onlineState
   ,   getSWState: () => ('serviceWorker' in navigator) && navigator.serviceWorker.controller
     });

OnlineStateStore.dispatchToken = QuizzrDispatch.register((action) => {
  switch (action.type) {
    case 'switch-offline':
      _onlineState = false;
      break;
  }
});
