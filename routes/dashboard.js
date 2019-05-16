var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.render('dashboard');
});


router.post('/post', (req, res) => {
    res.redirect("/upload");
});

module.exports = router;
