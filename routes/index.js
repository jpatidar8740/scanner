var express = require('express');
const { manager } = require('../utils/Manager');
var router = express.Router();


/* GET home page. */
router.post('/pushKey', function (req, res, next) {
  // Extract co-ordinates.
  console.log(req.body);
  var x = req.body.x;
  var y = req.body.y;

  var grid = manager.startProcessing(x, y);
  res.send({ status: "Received", grid: grid });
});

router.get('/getStatus', function (req, res, next) {
  res.send({ table: JSON.stringify(getTable()) });
});

module.exports = router;
