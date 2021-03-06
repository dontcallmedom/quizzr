
import React from "react";

let config = require("../config.json");

module.exports = {
    jsonHandler:    (res) => { return res.json(); }
,   catchHandler:   (e) => {
            console.error(e);
    }
,   pathPrefix: () => {
        return config.pathPrefix;
    }
,   endpoint: (str) => {
        str = str.replace(/^\//, "");
        return config.api + str;
    }
,   val:    (ref) => {
        let el = React.findDOMNode(ref)
        ,   value
        ;
        if (!el) return null;
        if (el.multiple) {
            value = [];
            for (var i = 0, n = el.selectedOptions.length; i < n; i++) {
                value.push(el.selectedOptions.item(i).value.trim());
            }
        }
        else value = el.value.trim();
        return value;
    }
  ,sendSWMessage: (message) => {
      // This wraps the message posting/response in a promise, which will resolve if the response doesn't
      // contain an error, and reject with the error if it does. If you'd prefer, it's possible to call
      // controller.postMessage() and set up the onmessage handler independently of a promise, but this is
      // a convenient wrapper.
      var p = new Promise(function(resolve, reject) {
        if (!navigator.serviceWorker.controller) {
          reject(new Error("No service worker installed yet"));
        }
        var messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = function(event) {
          if (event.data.error) {
            reject(event.data.error);
          } else {
            resolve(event.data);
          }
        };

        // This sends the message data as well as transferring messageChannel.port2 to the service worker.
        // The service worker can then use the transferred port to reply via postMessage(), which
        // will in turn trigger the onmessage handler on messageChannel.port1.
        // See https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage
        navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
      });
      return navigator.serviceWorker.ready.then(() => p);
    }
};
