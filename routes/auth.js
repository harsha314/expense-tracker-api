const express = require('express');
const { check } = require('express-validator');

const { SignUp, LogIn } = require('../controllers/auth');

const router = express.Router();

router.all('/', (req, res, next) => {
    console.log('Hello');
    next();
});

router.post(
    '/signup',
    [
        check('fname', 'Name is too short').isLength({ min: 3 }),
        check('email', 'Invalid Email').isEmail(),
        check('password', 'Password is too short').isLength({ min: 6 })
    ],
    SignUp
);

router.post(
    '/login',
    [
        check('email', 'Invalid Email').isEmail(),
        check('password', 'Password is too short').isLength({ min: 6 })
    ],
    LogIn
);

module.exports = router;
