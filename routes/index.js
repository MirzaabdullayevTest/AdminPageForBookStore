const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'BookStore' });
});

router.get('/category', function (req, res, next) {
  res.render('index', { title: 'BookStore' });
});

module.exports = router;
