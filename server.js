import express from 'express';
import cors from 'cors';
import { query } from 'fivem-server-query';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint to query a server by IP:Port
app.get('/api/server', async (req, res) => {
    const { ip, port } = req.query;

    if (!ip || !port) {
        return res.status(400).json({ error: 'Missing ip or port query parameters' });
    }

    try {
        const serverInfo = await query(`${ip}:${port}`);
        res.json(serverInfo);
    } catch (err) {
        console.error('Error querying server:', err);
        res.status(500).json({ error: 'Could not query server', details: err.message });
    }
});

// Health check
app.get('/', (req, res) => {
    res.send('FiveM Server Query API is running');
});

app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
});
