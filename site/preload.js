const { contextBridge, ipcRenderer, app } = require('electron');

contextBridge.exposeInMainWorld("ipcRenderer", {
    postMessage: function (channel, message) {
        ipcRenderer.send(channel, message);
    },
    on: function (channel, callback) {
        ipcRenderer.on(channel, callback);
    },
    off: function (channel, callback) {
        ipcRenderer.off(channel, callback);
    },
    removeAllListeners: function (channel) {
        ipcRenderer.removeAllListeners(channel);
    }
});