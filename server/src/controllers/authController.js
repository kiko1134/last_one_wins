import { users } from '../models/data.js';

export function register(req, res) {
    const { username } = req.body;
    if (users[username]) {
        return res.status(400).json({ error: "Потребителят вече съществува" });
    }
    users[username] = { username, score: 0 };
    return res.json({ success: true, username });
}

export function login(req, res) {
    const { username } = req.body;
    if (!users[username]) {
        users[username] = { username, score: 0 };
    }
    return res.json({ success: true, username });
}
