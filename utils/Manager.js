const router = require("../routes");
const { STATE } = require("./CommonUtils");
const { Scanner } = require("./Scanner");
var { broadcastUpdates } = require("./EventUpdater");



class Manager {

    constructor(row, column) {
        this.scanner = new Scanner();
        this.m = row;
        this.n = column;
        this.grid = new Array(this.m);
        for (var i = 0; i < this.m; i++) {
            this.grid[i] = new Array(this.n);
            for (var j = 0; j < this.n; j++) {
                this.grid[i][j] = STATE.INITIAL;
            }
        }
        this.cell = { x: parseInt(this.m / 2), y: parseInt(this.n / 2) };
        console.log("Initialising a grid of ", this.m, "x", this.n, " size.");
    }

    sendUpdates(msg) {
        broadcastUpdates(msg);
    }

    validateCoordinates(x, y) {
        if (x >= 0 && x < this.m && y >= 0 && y < this.n) {
            return true;
        }
        return false;
    }

    getTable() {
        return this.grid;
    }

    getCell() {
        return this.cell;
    }

    moveCell(move) {
        switch (move) {
            case "UP":
                this.startProcessing(this.cell["x"] - 1, this.cell["y"]);
                break;
            case "DOWN":
                this.startProcessing(this.cell["x"] + 1, this.cell["y"]);
                break;
            case "LEFT":
                this.startProcessing(this.cell["x"], this.cell["y"] - 1);
                break;
            case "RIGHT":
                this.startProcessing(this.cell["x"], this.cell["y"] + 1);
                break;

        }
    }

    resetGrid() {
        this.grid = new Array(this.m);
        for (var i = 0; i < this.m; i++) {
            this.grid[i] = new Array(this.n);
            for (var j = 0; j < this.n; j++) {
                this.grid[i][j] = STATE.INITIAL;
            }
        }
        this.cell = { x: parseInt(this.m / 2), y: parseInt(this.n / 2) };
        this.startProcessing(this.cell["x"], this.cell["y"]);
    }

    startProcessing(x, y) {
        if (!this.validateCoordinates(x, y)) {
            console.log("Invalid coordinates");
            return;
        }

        this.cell = { x: x, y: y };
        console.log("Started processing: ", this.cell);

        if (this.grid[x][y] == STATE.PROCESSED) {
            console.log("Ignoring processing as this cell is already processed");
            return;
        }

        if (this.scanner.getState() != 0) {
            console.log("Scanner busy");
            this.grid[x][y] = STATE.IGNORED;
        } else {
            this.grid[x][y] = STATE.FOCUSING;
            this.scanner.startFocusing(x, y)
                .then((res) => {
                    console.log("Focusing finished.");
                    this.grid[res["x"]][res["y"]] = res["state"];
                    this.mayStartCapturing(res);
                }).catch((e) => {
                    console.log(e);
                    this.sendUpdates({ err: true, msg: "An error occurred on machine while focusing." });
                });
        }

        this.sendUpdates("Table update, please refresh!");
    }

    mayStartCapturing(res) {
        if (this.scanner.getState() == 0 && this.cell["x"] == res["x"] && this.cell["y"] == res["y"]) {
            this.grid[res["x"]][res["y"]] = STATE.CAPTURING;
            this.scanner.startCapturing(res["x"], res["y"])
                .then((result) => {
                    console.log("Capturing finished.");
                    this.grid[result["x"]][result["y"]] = result["state"];
                    this.processCapture(result);
                })
                .catch((err) => {
                    console.log(err);
                    this.sendUpdates({ err: true, msg: "An error occurred on machine while capturing." });
                });
        } else if (this.scanner.getState() == 0) {
            console.log("Started  on latest coordinate");
            this.startProcessing(this.cell["x"], this.cell["y"]);
        }
        this.sendUpdates("Table update, please refresh!");
    }

    processCapture(res) {
        if (this.cell["x"] == res["x"] && this.cell["y"] == res["y"]) {
            console.log("Machine idle");
        } else {
            this.startProcessing(this.cell["x"], this.cell["y"]);
            console.log("Started  on latest coordinate");
        }
        this.sendUpdates("Table update, please refresh!");
    }
}

const manager = new Manager(20, 60);
var currCell = manager.getCell();
manager.startProcessing(currCell["x"], currCell["y"]);

module.exports = { manager };


