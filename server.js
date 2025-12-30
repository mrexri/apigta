import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000; // Render sets PORT dynamically

app.use(cors()); // Allow all origins

// Endpoint to get a single server by ID
app.get('/api/servers/single/:serverId', async (req, res) => {
    const serverId = req.params.serverId;

    try {
        const response = await fetch(`https://servers.fivem.net/api/servers/single/${serverId}`);
        if (!response.ok) throw new Error('Server not found');

        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Optional: Endpoint to get all servers
app.get('/api/servers/all', async (req, res) => {
    try {
        const response = await fetch('https://servers.fivem.net/api/servers/');
        if (!response.ok) throw new Error('Failed to fetch servers');

        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`FiveM API running on port ${PORT}`);
});
