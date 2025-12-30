import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Allow all origins

// Simple in-memory cache
const cache = {};
const CACHE_DURATION = 60 * 1000; // 1 minute

// Helper: fetch server info with caching
async function getServerInfo(serverId) {
    const now = Date.now();

    // Return cached if exists and not expired
    if (cache[serverId] && now - cache[serverId].timestamp < CACHE_DURATION) {
        return cache[serverId].data;
    }

    // Fetch from FiveM API
    const response = await fetch(`https://servers.fivem.net/api/servers/single/${serverId}`);
    const contentType = response.headers.get('content-type');

    if (!response.ok) {
        const text = await response.text();
        throw { status: 404, message: 'Server not found', details: text };
    }

    if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw { status: 500, message: 'FiveM API returned invalid response', details: text };
    }

    const data = await response.json();

    // Cache the result
    cache[serverId] = { timestamp: now, data };

    return data;
}

// Endpoint: Get single server
app.get('/api/servers/single/:serverId', async (req, res) => {
    const serverId = req.params.serverId;

    try {
        const data = await getServerInfo(serverId);
        res.json(data);
    } catch (err) {
        console.error('Error fetching server:', err);
        res.status(err.status || 500).json({ error: err.message, details: err.details || null });
    }
});

// Optional: Get all servers
app.get('/api/servers/all', async (req, res) => {
    try {
        const response = await fetch('https://servers.fivem.net/api/servers/');
        const contentType = response.headers.get('content-type');

        if (!response.ok) {
            const text = await response.text();
            return res.status(500).json({ error: 'Failed to fetch servers', details: text });
        }

        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            return res.status(500).json({ error: 'FiveM API returned invalid response', details: text });
        }

        const data = await response.json();
        res.json(data);

    } catch (err) {
        console.error('Error fetching all servers:', err);
        res.status(500).json({ error: err.message });
    }
});

// Health check
app.get('/', (req, res) => {
    res.send('FiveM API is running');
});

app.listen(PORT, () => {
    console.log(`FiveM API running on port ${PORT}`);
});
