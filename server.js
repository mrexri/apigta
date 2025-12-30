const express = require('express');
const fetch = require('node-fetch'); // Node 18+ can use global fetch
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS for all origins
app.use(cors());

// Endpoint to get a single server by ID
app.get('/api/servers/single/:serverId', async (req, res) => {
    const serverId = req.params.serverId;

    try {
        // Call the official FiveM servers API
        const response = await fetch(`https://servers.fivem.net/api/servers/single/${serverId}`);
        if (!response.ok) throw new Error('Server not found');

        const data = await response.json();

        // Send it back to your front-end
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Optional: Endpoint to get all servers
app.get('/api/servers/all', async (req, res) => {
    try {
        const response = await fetch('https://servers.fivem.net/api/servers/');
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`FiveM Server API running on http://localhost:${PORT}`);
});
