import QuizzrDispatch from "../dispatcher";
import assign from "object-assign";
import EventEmitter from "events";

let _onlineState = true,
     OnlineStateStore = module.exports =  assign({}, EventEmitter.prototype, {
       emitChange: function () { this.emit("change"); }
   ,   addChangeListener: function (cb) { this.on("change", cb); }
   ,   removeChangeListener: function (cb) { this.removeListener("change", cb); }
   ,   getOnlineState: () => _onlineState
     });

OnlineStateStore.dispatchToken = QuizzrDispatch.register((action) => {
  switch (action.type) {
    case 'switch-offline':
      console.log("switched off-line");
      _onlineState = false;
      break;
  }
});
