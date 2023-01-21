var socket = io();

getTable();

window.addEventListener("keydown", (e) => {
    console.log(e);
    if (e.code == "ArrowLeft") {
        sendMoves("LEFT");
    } else if (e.code == "ArrowUp") {
        sendMoves("UP");
    } else if (e.code == "ArrowRight") {
        sendMoves("RIGHT");
    } else if (e.code == "ArrowDown") {
        sendMoves("DOWN");
    }
});

socket.on("tableUpdated", (data) => {
    console.log(data);
    if (data.err) {
        alert(data.msg);
    } else {
        getTable();
    }
});