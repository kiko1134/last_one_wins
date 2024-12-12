const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../client/src/views'));

app.use(express.static(path.join(__dirname, '../../client/src')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index', {
        //тествах как се подават данни на шаблона
        timeLeft: 30,
        question: 'What is the capital of France?',
        players: [
            { name: 'Player 1', score: 0 },
            { name: 'Player 2', score: 0 },
            { name: 'Player 3', score: 0 }
        ]
    });
});
app.get('/register', (req, res) => {
    res.render('register');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
