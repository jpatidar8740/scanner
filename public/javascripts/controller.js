

const STATE = {
    INITIAL: "inital",
    IGNORED: "ignored",
    FOCUSING: "focusing",
    FOCUSED: "focused",
    CAPTURING: "capturing",
    PROCESSED: "processed"
};


var grid = new gridjs.Grid({
    data: [],
});

grid.render(document.getElementById("container"));


function updateGrid(table, activeCell) {

    var m = table.length;
    var n = table[0].length;
    var data = new Array(m);

    for (var i = 0; i < m; i++) {
        data[i] = new Array(n);
        for (var j = 0; j < n; j++) {
            var isActive = "";
            if (activeCell["x"] == i && activeCell["y"] == j) {
                isActive = "active";
            }
            switch (table[i][j]) {
                case STATE.INITIAL:
                    data[i][j] = gridjs.html(`<p class="cell initial ${isActive}">.</p>`);
                    break;
                case STATE.IGNORED:
                    data[i][j] = gridjs.html(`<p class="cell ignored ${isActive}">O</p>`);
                    break;
                case STATE.FOCUSING:
                    data[i][j] = gridjs.html(`<p class="cell focusing ${isActive}">🔬</p>`);
                    break;
                case STATE.FOCUSED:
                    data[i][j] = gridjs.html(`<p class="cell focused ${isActive}">O</p>`);
                    break;
                case STATE.CAPTURING:
                    data[i][j] = gridjs.html(`<p class="cell capturing ${isActive}">📸</p>`);
                    break;
                case STATE.PROCESSED:
                    data[i][j] = gridjs.html(`<p class="cell processed ${isActive}">✅</p>`);
                    break;
                default:
                    data[i][j] = gridjs.html(`<p class="cell initial ${isActive}">.</p>`);
            }
        }
    }

    grid.updateConfig({ data: data }).forceRender();
}

function getTable() {
    var url = "/getStatus";
    axios({
        method: 'get',
        url: url,
        responseType: 'applicaton/json'
    })
        .then(function (res) {
            var data = JSON.parse(res.data);
            updateGrid(JSON.parse(data["table"]), data["activeCell"]);
        })
        .catch((e) => {
            console.log(e);
            alert("Some error ocured while retrieving history, please retry.")
        });
}

function sendMoves(key) {
    console.log("Sending move: ", key);
    var url = "/pushKey";
    axios({
        method: 'post',
        url: url,
        data: {
            move: key
        }
    })
        .then(function (res) {
            console.log(res.data.status);
        })
        .catch((e) => {
            console.log(e);
            alert("Some error ocured while updating camera position, please retry.");
        });
}

function resetGrid() {
    console.log("Resetting grid.");
    var url = "/resetGrid";
    axios({
        method: 'post',
        url: url,
    })
        .then(function (res) {
            console.log(res.data.status);
            alert("Grid resetted successfully.");
        })
        .catch((e) => {
            console.log(e);
            alert("Some error ocured while resetting grid, please retry.");
        });
}