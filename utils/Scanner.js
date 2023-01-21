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
            return { x: x, y: y, state: STATE.IGNORED };
        }

        this.state = 1;
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.state = 0;
                resolve({ x: x, y: y, state: STATE.FOCUSED });
            }, 3000);
        });
    }

    async startCapturing(x, y) {
        if (this.state != 0) {
            return { x: x, y: y, state: STATE.IGNORED };
        }

        this.state = 2;
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.state = 0;
                resolve({ x: x, y: y, state: STATE.PROCESSED });
            }, 2000);
        });
    }

}

module.exports = { Scanner };