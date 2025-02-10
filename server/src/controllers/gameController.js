const { games } = require('../models/data');
const { generateGameID } = require('../utils/helpers');

exports.createGame = (req, res) => {
    const { players } = req.body; // Expects array of objects: [{ username: "Player1" }, ...]
    if (!players || players.length < 1) {
        return res.status(400).json({ error: "Необходими са поне 1 играч" });
    }
    const gameID = generateGameID();
    games[gameID] = {
        gameID,
        players: players.map(p => ({ username: p.username, score: 0, eliminated: false })),
        currentRound: 1,
        currentTopic: 1,  // Start topic
        currentQuestion: null,
        currentTurn: 0,
        buzzerLockedBy: null
    };
    res.json({ success: true, gameID });
};
