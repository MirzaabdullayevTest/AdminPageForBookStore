const express = require('express');
const Admin = require('../models/Admin');
const router = express.Router();
const bcrypt = require('bcryptjs')
const isAdmin = require('../middleware/isAdmin')

/* GET users listing. */
router.get('/login', async function (req, res, next) {
    const isAdmin = await Admin.findOne({ typeAdmin: 'admin' })  // true

    req.session.isAdmin = !isAdmin  // agar admin bor bo'lsa isAdmin true tushadi va ! false qivoradi // agar admin yo'q unda false tushadi ! uni true qivoravi


    res.render('auth/login', {
        layout: 'auth',
        title: 'Login',
        loginError: req.flash('loginError'),
        success: req.flash('success'),
        isAdmin: !isAdmin  // false
    });
});

router.post('/login', async function (req, res, next) {
    try {
        const { email, password } = req.body
        // password  1123456
        const candidate = await Admin.findOne({ email })

        if (candidate) {
            // const areSame = candidate.password === password
            const areSame = await bcrypt.compare(password, candidate.password)
            if (areSame) {
                req.session.isAuthen = true
                req.session.admin = candidate
                req.session.isAdmin = candidate.typeAdmin === 'admin' ? true : false
                req.session.save((err) => {
                    if (err) {
                        throw new Error
                    }
                    // res.setHeader('Content-type', 'application/json')
                    res.redirect('/admin')
                })
            } else {
                req.flash('loginError', 'Password is incorrect')
                res.redirect('/auth/login')
            }

        } else {
            //Admin baza yo'q
            req.flash('loginError', 'Admin is not found')
            res.redirect('/auth/login')
        }
    } catch (error) {
        console.log(error);
    }
})

router.get('/register', isAdmin, function (req, res, next) {
    res.render('auth/register', {
        layout: 'auth',
        title: 'Register',
        registerError: req.flash('registerError')
    });
});

router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password, img, typeAdmin } = req.body
        // password // 123456
        const candidate = await Admin.findOne({ email })

        if (candidate) {
            req.flash('registerError', 'Login is busy')
            res.redirect('/auth/register')
        } else {
            const hashPassword = await bcrypt.hash(password, 12)
            const admin = new Admin({
                name, password: hashPassword, email, img, typeAdmin
            })
            await admin.save()
            req.flash('success', 'Admin is registreted successfull')
            res.redirect('/auth/login')
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

module.exports = router;
