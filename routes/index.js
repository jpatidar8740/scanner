var express = require('express');
var path = require('path');
const { manager } = require('../utils/Manager');
var router = express.Router();

var viewsPath = path.join(__dirname, '../views');

/* GET home page. */
router.get("/", function (req, res, next) {
  res.sendFile(viewsPath + "/index.html");
});


router.post('/pushKey', function (req, res, next) {
  manager.moveCell(req.body.move);
  console.log(manager.getTable());
  res.send({ status: "Received" });
});

router.get('/getStatus', function (req, res, next) {
  res.send({ table: JSON.stringify(manager.getTable()), activeCell: manager.getCell() });
});

module.exports = router;
