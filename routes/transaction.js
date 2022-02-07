const express = require('express');

const { generateAuth, isAuthenticated } = require('../controllers/auth');
const {
    isOwner,
    getTransaction,
    getTransactionById,
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction
} = require('../controllers/transaction');

const router = express.Router({ mergeParams: true });

router.param('transactionId', getTransactionById);

// CREATE

router.post('/', createTransaction);

// READ

router.get('/', generateAuth, isAuthenticated, getTransactions);

router.get(
    '/:transactionId',
    generateAuth,
    isAuthenticated,
    isOwner,
    getTransaction
);

// UPDATE

router.put(
    '/:transactionId',
    generateAuth,
    isAuthenticated,
    isOwner,
    updateTransaction
);

// DELETE

router.delete(
    '/:transactionId',
    generateAuth,
    isAuthenticated,
    isOwner,
    deleteTransaction
);

module.exports = router;
