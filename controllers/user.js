const User = require('../models/User');

exports.getUserById = async (req, res, next, id) => {
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        req.userProfile = user;
        next();
    } catch (e) {
        return res.status(400).json({ error: e.message });
    }
};

exports.getUser = (req, res) => {
    const { email, fname, lname } = req.userProfile;
    console.log(`User get request`);
    return res.json({
        email,
        fname,
        lname
    });
};
