const express = require('express');

const { generateAuth, isAuthenticated } = require('../controllers/auth');
const { getUserById, getUser } = require('../controllers/user');
const transactionRoutes = require('./transaction.js');

const router = express.Router();

router.param('userId', getUserById);

router.get('/:userId', generateAuth, isAuthenticated, getUser);

router.use('/:userId/transaction', transactionRoutes);

module.exports = router;
