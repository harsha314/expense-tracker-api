const faker = require('faker');

const sequelize = require('../db');

const User = require('../models/User');

const Transaction = require('../models/Transaction');

async function generateFakeData() {
    const user = await User.create({
        email: `testmail@email.com`,
        fname: `test_fname`,
        lname: `test_lname`,
        password: `testpass`
    });
    const { id } = user;
    for (i = 0; i < 100; ++i) {
        let timeOfTransaction = faker.date.past();
        let amount = faker.finance.amount();
        let owner = id;
        const type = faker.finance.transactionType();
        if (type == 'payment') amount *= -1;
        await Transaction.create({ timeOfTransaction, amount, owner });
    }
    console.log(`fake data generated`);
}

module.exports = generateFakeData;
