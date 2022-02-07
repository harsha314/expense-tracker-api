require('dotenv').config();

const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/User');

const SECRET = process.env.SECRET;

exports.SignUp = async (req, res) => {
    const errors = validationResult(req);
    if (errors.length) {
        return res.status(400).json({
            errors: [...errors]
        });
    }

    const { email, fname, lname, password } = req.body;
    try {
        const user = await User.create({ email, fname, lname, password });

        return res.json({
            msg: 'Sign-Up Successful'
        });
    } catch (e) {
        return res.status(400).json({ error: e.message });
    }
};

exports.LogIn = async (req, res) => {
    const errors = validationResult(req);
    if (errors.length) {
        return res.status(400).json({
            errors: [...errors]
        });
    }

    const { email, password } = req.body;
    try {
        const user = await User.findOne({
            where: { email }
        });
        if (!user || !user.authenticate(password)) {
            return res.status(404).json({
                error: 'Invalid Credentials'
            });
        }
        const { id, encry_password } = user;
        const token = jwt.sign({ id, encry_password }, SECRET, {
            expiresIn: 24 * 60 * 60 * 1000
        });
        res.cookie(`Authorization`, `Bearer ${token}`);
        return res.json({
            msg: `Welcome ${user.fullName}`,
            token: `Bearer ${token}`
        });
    } catch (e) {
        return res.status(400).json({ error: e.message });
    }
};

exports.generateAuth = expressJwt({
    secret: SECRET,
    algorithms: ['HS256'],
    requestProperty: 'auth'
});

exports.isAuthenticated = (req, res, next) => {
    const checker =
        req.userProfile &&
        req.auth &&
        req.userProfile._id == req.auth._id &&
        req.userProfile.encry_password == req.auth.encry_password;
    if (!checker) {
        return res.status(403).json({
            msg: 'Unauthenticated'
        });
    }
    next();
};
