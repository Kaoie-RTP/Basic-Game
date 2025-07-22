const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = 'players.json';

// Helper to load/save data
function loadData() {
    if (!fs.existsSync(DATA_FILE)) return {};
    return JSON.parse(fs.readFileSync(DATA_FILE));
}
function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Sign up
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    let data = loadData();
    if (data[username]) return res.status(400).json({ error: 'User exists' });
    data[username] = {
        password,
        stats: { health: 100, mana: 50, level: 1, experience: 0, gold: 0, gems: 0 }
    };
    saveData(data);
    res.json({ success: true });
});

// Sign in
app.post('/signin', (req, res) => {
    const { username, password } = req.body;
    let data = loadData();
    if (!data[username] || data[username].password !== password)
        return res.status(400).json({ error: 'Invalid credentials' });
    res.json({ stats: data[username].stats });
});

// Save stats
app.post('/savestats', (req, res) => {
    const { username, stats } = req.body;
    let data = loadData();
    if (!data[username]) return res.status(400).json({ error: 'User not found' });
    data[username].stats = stats;
    saveData(data);
    res.json({ success: true });
});

// Load stats
app.get('/loadstats/:username', (req, res) => {
    let data = loadData();
    const user = req.params.username;
    if (!data[user]) return res.status(400).json({ error: 'User not found' });
    res.json({ stats: data[user].stats });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));