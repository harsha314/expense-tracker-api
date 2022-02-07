const Transaction = require('../models/Transaction');
const { Op } = require('sequelize');

exports.isOwner = (req, res, next) => {
    const checker =
        req.transaction.owner &&
        req.userProfile.id &&
        req.transaction.owner == req.userProfile.id;
    if (!checker) {
        return res.status(400).json({ error: 'You are not the owner' });
    }
    next();
};

exports.createTransaction = async (req, res) => {
    const { amount, timeOfTransaction = Date.now() } = req.body;
    try {
        const { id: owner } = req.userProfile;
        const transaction = await Transaction.create({
            amount,
            owner,
            timeOfTransaction
        });
        return res.json({ msg: `Transaction saved` });
    } catch (e) {
        return res.status(400).json({ error: e.message });
    }
};

exports.getTransactionById = async (req, res, next, transactionId) => {
    try {
        const transaction = await Transaction.findByPk(transactionId);
        if (!transaction || transaction.owner != req.userProfile.id) {
            return res.status(400).json({ error: `Invalid Transaction ID` });
        }
        req.transaction = transaction;
    } catch (e) {
        return res.status(400).json({ error: e.message });
    }
    next();
};

exports.getTransaction = (req, res) => {
    try {
        const transaction = req.transaction;
        return res.json(transaction);
    } catch (e) {
        return res.status(400).json({ error: e.message });
    }
};

exports.getTransactions = async (req, res) => {
    let { from, to, page = 1, limit = 10, dateFormat } = req.query;
    let offset = (page - 1) * limit;
    let startDate;
    let endDate;
    if (!dateFormat) {
        if (from) {
            from = from.split('-').map((x) => parseInt(x));
            from = [from[0], from[1] - 1, from[2]];
        }
        if (to) {
            to = to.split('-').map((x) => parseInt(x));
            to = [to[0], to[1] - 1, to[2]];
        }
    }
    if (dateFormat == 'sec') {
        if (from) {
            startDate = new Date(parseInt(from));
        }
        if (to) {
            endDate = new Date(parseInt(to));
        }
    }
    if (dateFormat == 'mm-dd-yyyy') {
        if (from) {
            from = from.split('-').map((x) => parseInt(x));
        }
        from = [from[1], from[0] - 1, from[2]];
        if (to) {
            to = to.split('-').map((x) => parseInt(x));
        }
        to = [to[1], to[0] - 1, to[2]];
    }

    if (!from) {
        let temp = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        from = [temp.getDay(), temp.getMonth(), temp.getFullYear()];
    }
    if (!to) {
        let temp = new Date(Date.now());
        to = [temp.getDay(), temp.getMonth(), temp.getFullYear()];
    }
    console.log(`from ${from}`);
    console.log(`to ${to}`);
    startDate = new Date(from[2], from[1], from[0]);
    endDate = new Date(to[2], to[1], to[0]);
    try {
        const transactions =
            (await Transaction.findAll({
                order: [['timeOfTransaction', 'DESC']],
                limit,
                offset,
                where: {
                    timeOfTransaction: { [Op.between]: [startDate, endDate] }
                }
            })) || [];
        const count = await Transaction.count({
            where: {
                timeOfTransaction: { [Op.between]: [startDate, endDate] }
            }
        });
        const amountSpent =
            (await Transaction.sum('amount', {
                where: {
                    timeOfTransaction: { [Op.between]: [startDate, endDate] }
                }
            })) || 0;
        return res.json({
            amountSpent,
            count,
            page,
            transactions: [...transactions]
        });
    } catch (e) {
        return res.status(400).json({ msg: e.message });
    }
};

exports.updateTransaction = async (req, res) => {
    const { amount, timeOfTransaction } = req.body;
    const transaction = req.transaction;
    try {
        transaction.amount = amount || transaction.amount;
        transaction.timeOfTransaction =
            timeOfTransaction || transaction.timeOfTransaction;
        await transaction.save();
        return res.json({ msg: `Transaction updated` });
    } catch (e) {
        return res.status(400).json({ error: e.message });
    }
};

exports.deleteTransaction = async (req, res) => {
    const transaction = req.transaction;
    try {
        await transaction.destroy();
        return res.json({ msg: `Transaction Deleted` });
    } catch (e) {
        return res.status(400).json({ error: e.message });
    }
};
