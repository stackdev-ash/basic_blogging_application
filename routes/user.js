const { Router } = require('express');
const router = Router();
const user = require('../models/user')

router.get('/signin', (req, res) => {
    return res.render("signin")
});

router.get('/signup', (req, res) => {
    return res.render("signup")
});

router.get('/logout', (req, res) => {
    res.clearCookie("token").redirect("/");
});

router.post('/signup', async (req, res) => {
    const { fullname, email, password } = req.body;
    await user.create({
        fullname,
        email,
        password,
    });
    return res.redirect("/");
})

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await user.matchpasswordandgeneratetoken(email, password);
        return res.cookie('token', token).redirect("/");
    } catch (error) {
        return res.render("signin", {
            error: "incorrect email or password"
        }
        );
    }
})

module.exports = router;