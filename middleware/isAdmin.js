module.exports = function (req, res, next) {
    if (!req.session.isAdmin) {
        res.redirect('/auth/error')
    }

    next()
}