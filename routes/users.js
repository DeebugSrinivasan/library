var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('cool', {name : 'Deepakh'});
});
router.get('/cool', function(req, res) {
  res.send("HI BROTHER");
})


module.exports = router;
