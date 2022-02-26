module.exports = function (req, res, next) {
    res.locals.isAuth = req.session.isAuthen // true
    res.locals.admin = req.session.admin
    console.log(req.session.isAdmin);
    res.locals.isAdmin = req.session.isAdmin  // false // true
    next()
}