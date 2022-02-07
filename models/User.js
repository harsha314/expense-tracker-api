const crypto = require('crypto');

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');

const UserSchema = {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    fname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lname: {
        type: DataTypes.STRING
    },
    fullName: {
        type: DataTypes.VIRTUAL,
        get() {
            return `${this.fname} ${this.lname}`;
        }
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    encry_password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    salt: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false
    },
    password: {
        type: DataTypes.VIRTUAL,
        set: function (plainPassword) {
            this.encry_password = this.securePassword(plainPassword);
        }
    }
};

class User extends Model {
    securePassword(plainPassword) {
        if (!plainPassword) return '';
        return crypto
            .createHmac('sha256', this.salt)
            .update(plainPassword)
            .digest('hex');
    }
    authenticate(plainPassword) {
        return this.securePassword(plainPassword) == this.encry_password;
    }
}

User.init(UserSchema, { sequelize, modelName: 'Users' });

module.exports = User;
