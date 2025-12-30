import express from "express";
import cors from "cors";
import FiveM from "fivem-stats";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Query server status using ip & port query parameters
app.get("/api/server", async (req, res) => {
  const { ip, port } = req.query;

  if (!ip || !port) {
    return res
      .status(400)
      .json({ error: "Missing required query params: ip & port" });
  }

  try {
    // Create `fivem-stats` object
    const server = new FiveM.Stats(`${ip}:${port}`);

    // Fetch server info
    const serverStatus = await server.getServerStatus();
    const players = await server.getPlayers();
    const allPlayers = await server.getPlayersAll();
    const resources = await server.getResources();

    res.json({
      status: serverStatus,
      players,
      allPlayers,
      resources,
    });
  } catch (err) {
    console.error("Error querying FiveM server:", err);
    res.status(500).json({ error: "Could not query server", details: err });
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("FiveM Server API is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
