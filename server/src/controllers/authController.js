import { users } from '../models/data.js';
import User from "../models/User.js";

export async function register(req, res) {
    try {
        const { username, password, email } = req.body;
        const user = new User({ username, password, email });
        await user.save();
        return res.json({ success: true, username });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: "Error registering user" });
    }
}

export function login(req, res) {
    const { username } = req.body;
    if (!users[username]) {
        users[username] = { username, score: 0 };
    }
    return res.json({ success: true, username });
}
