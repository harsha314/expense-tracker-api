require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const generateData = require('./fakeData/generate');

const { PORT = 3000, NODE_ENV } = process.env;

// database
const sequelize = require('./db');

async function connection() {
    try {
        await sequelize.authenticate();
        console.log(`DATABASE connected`);
        await sequelize.sync({ force: true });
        console.log(`MODELS created`);
        if (NODE_ENV == 'development') {
            await generateData();
        }
    } catch (e) {
        console.log(e.message);
    }
}

connection();

const app = express();

app.use(cors());

// for request params
app.use(bodyParser.urlencoded({ extended: true }));

// request body
app.use(bodyParser.json());

app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});
