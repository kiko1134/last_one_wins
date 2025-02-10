const { users } = require('../models/data');

exports.register = (req, res) => {
    const { username } = req.body;
    if (users[username]) {
        return res.status(400).json({ error: "Потребителят вече съществува" });
    }
    users[username] = { username, score: 0 };
    return res.json({ success: true, username });
};

exports.login = (req, res) => {
    const { username } = req.body;
    if (!users[username]) {
        users[username] = { username, score: 0 };
    }
    return res.json({ success: true, username });
};
