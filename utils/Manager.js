const router = require("../routes");
const { STATE } = require("./CommonUtils");
const { Scanner } = require("./Scanner");



class Manager {

    constructor(row, column) {
        this.scanner = new Scanner();
        this.m = row;
        this.n = column;
        this.grid = Array(this.m).fill(Array(this.n).fill(STATE.INITIAL));
        this.cell = { x: parseInt(this.m / 2), y: parseInt(this.y / 2) };
    }

    startProcessing(x, y) {
        if (!this.validateCoordinates) {
            return;
        }

        console.log("Started processing");


        this.cell = { x: x, y: y };
        if (this.scanner.getState() != 0) {
            console.log("Scanner busy");
            this.grid[x][y] = STATE.IGNORED;
        } else {
            this.grid[x][y] = STATE.FOCUSING;
            this.scanner.startFocusing(x, y)
                .then((res) => {
                    console.log("focusing finished.");
                    this.grid[x][y] = res["state"];
                    console.log("Current cell: ", this.cell);
                    console.log("Response from focusing: ", res);
                    this.mayStartCapturing(res);
                }).catch((e) => {
                    console.log(e);
                    // some error occured while focusing image.
                    // sendUpdates() with error
                });
        }
    }

    sendUpdates() {
        console.log("-".repeat(100));
        console.log(this.grid);
        console.log("-".repeat(100));
    }

    validateCoordinates(x, y) {
        if (x >= 0 && x < m && y >= 0 && y < n) {
            return true;
        }
        return false;
    }

    mayStartCapturing(res) {
        if (this.scanner.getState() == 0 && this.cell["x"] == res["x"] && this.cell["y"] == res["y"]) {
            this.grid[x][y] = STATE.CAPTURING;
            this.scanner.startCapturing(x, y)
                .then((res) => {
                    console.log("capturing finished.");
                    this.grid[x][y] = res["state"];
                    console.log("Current cell: ", this.cell);
                    console.log("Response from capture: ", res);
                    this.processCapture(res);
                })
                .catch((err) => {
                    console.log(err);
                    // some error occured while capturing image.
                    // sendUpdates() with error
                });
        } else if (this.scanner.getState() == 0) {
            console.log("Started  on latest coordinate");
            this.startProcessing(this.cell["x"], this.cell["y"]);
        }
    }

    processCapture(res) {
        // sendUpdates();
        if (this.cell["x"] == res["x"] && this.cell["y"] == res["y"]) {
            // sit idle
            console.log("machine idle");
        } else {
            this.startProcessing(this.cell["x"], this.cell["y"]);
            console.log("Started  on latest coordinate");
        }
    }
}

const manager = new Manager(20, 60);

module.exports = { manager };


