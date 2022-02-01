const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/login', function (req, res, next) {
    res.render('auth/login', {
        layout: 'auth',
        title: 'Login'
    });
});

router.get('/register', function (req, res, next) {
    res.render('auth/register', {
        layout: 'auth',
        title: 'Register'
    });
});

router.post('/login', function (req, res, next) {
    req.session.isAuthen = true

    req.session.save((err) => {
        if (err) {
            throw new Error
        }
        res.redirect('/admin')
    })
})

router.get('/logout', function (req, res, next) {
    // req.session.isAuthen = false
    req.session.destroy(() => {
        res.redirect('/auth/login')
    })
})

router.get('/error', function (req, res, next) {
    res.render('error404', {
        layout: 'auth',
        title: 'Not found'
    })
})

module.exports = router;
