const { DataTypes, Model } = require('sequelize');

const sequelize = require('../db');

const TransactionSchema = {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    amount: {
        type: DataTypes.INTEGER
        // positve  => INCOME
        // neagtive => EXPENSE
    },
    owner: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    timeOfTransaction: {
        type: DataTypes.DATE
    }
};

class Transaction extends Model {}

Transaction.init(TransactionSchema, { sequelize, modelName: `Transactions` });

module.exports = Transaction;
