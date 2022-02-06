const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs')

/* GET users listing. */
router.get('/login', function (req, res, next) {
    res.render('auth/login', {
        layout: 'auth',
        title: 'Login',
        error: req.flash('error')
    });
});

router.get('/register', function (req, res, next) {
    res.render('auth/register', {
        layout: 'auth',
        title: 'Register'
    });
});

router.post('/login', async function (req, res, next) {
    try {
        const { email, password } = req.body
        // password  1123456
        const candidate = await User.findOne({ email })

        if (!candidate) {
            //user baza yo'q
            res.redirect('/auth/login')
        }

        // const areSame = candidate.password === password
        const areSame = await bcrypt.compare(password, candidate.password)

        if (!areSame) {
            res.redirect('/auth/login')
        } else {
            req.session.isAuthen = true
            req.session.save((err) => {
                if (err) {
                    throw new Error
                }
                // res.setHeader('Content-type', 'application/json')
                res.redirect('/admin')
            })
        }
    } catch (error) {
        console.log(error);
    }
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

router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password } = req.body

        // password // 123456

        const candidate = await User.findOne({ email })

        if (candidate) {
            req.flash('error', 'Login is busy')
            res.redirect('/auth/login')
        } else {
            const hashPassword = await bcrypt.hash(password, 12)

            const user = new User({
                name, password: hashPassword, email
            })
            await user.save()
            res.redirect('/auth/login')
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;
