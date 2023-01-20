const { STATE } = require("./CommonUtils");

class Scanner {

    constructor() {
        this.state = 0;
    }

    getState() {
        return this.state;
    }

    async startFocusing(x, y) {
        if (this.state != 0) {
            console.log("Ignored by scanner");
            return { x: x, y: y, state: STATE.IGNORED };
        }

        console.log("Started focusing");
        this.state = 1;
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("finshd focusing");
                this.state = 0;
                resolve({ x: x, y: y, state: STATE.FOCUSED });
            }, 5000);
        });
    }

    async startCapturing(x, y) {
        if (this.state != 0) {
            console.log("Ignored by scanner");
            return { x: x, y: y, state: STATE.IGNORED };
        }

        console.log("Started capturing");
        this.state = 2;
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("finshd capturing");
                this.state = 0;
                resolve({ x: x, y: y, state: STATE.PROCESSED });
            }, 10000);
        });
    }

}

module.exports = { Scanner };