const { Server } = require("socket.io");

var io;

function initiateIo(server) {
    io = new Server(server);
}

function broadcastUpdates(msg) {
    if (io) {
        io.emit("tableUpdated", msg);
    }
}

module.exports = { initiateIo, broadcastUpdates };