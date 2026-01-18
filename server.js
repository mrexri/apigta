import express from "express";
import cors from "cors";
import axios from "axios"; // Needed for HTTPS requests

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Query server status using server ID
app.get("/api/server", async (req, res) => {
  const { serverId } = req.query;

  if (!serverId) {
    return res.status(400).json({ error: "Missing required query param: serverId" });
  }

  try {
    const response = await axios.get(
      `https://servers-frontend.fivem.net/api/servers/single/vz9bar`
    );

    const serverData = response.data;

    // You can format the data to match your old API structure if needed
    res.json({
      info: serverData.Data?.vars || {},  // Server variables
      players: serverData.Data?.clients || 0,
      maxPlayers: serverData.Data?.sv_maxclients || 0,
      resources: serverData.Data?.resources || [],
      raw: serverData, // full raw response if needed
    });
  } catch (err) {
    console.error("Error fetching server data:", err.message);
    res.status(500).json({ error: "Could not fetch server data", details: err.message });
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("FiveM Server API is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
