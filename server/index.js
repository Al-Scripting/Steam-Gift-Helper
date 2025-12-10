const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); // Allows your React app to talk to this server

const API_KEY = process.env.STEAM_API_KEY;
const BASE_URL = 'http://api.steampowered.com';

// Endpoint 1: Find User ID from Username (e.g., "shroud")
app.get('/api/search/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    // 1. Resolve Vanity URL (convert name to ID)
    const resolveRes = await axios.get(`${BASE_URL}/ISteamUser/ResolveVanityURL/v0001/`, {
        params: { key: API_KEY, vanityurl: username }
    });

    let steamId = resolveRes.data.response.steamid;

    // If vanity lookup fails, maybe they typed the ID directly?
    if (resolveRes.data.response.success !== 1) {
        if (/^\d{17}$/.test(username)) {
            steamId = username; // It was already an ID
        } else {
            return res.status(404).json({ error: "User not found" });
        }
    }

    // 2. Get User Summary (Avatar, Status)
    const summaryRes = await axios.get(`${BASE_URL}/ISteamUser/GetPlayerSummaries/v0002/`, {
        params: { key: API_KEY, steamids: steamId }
    });

    // 3. Get Owned Games
    const gamesRes = await axios.get(`${BASE_URL}/IPlayerService/GetOwnedGames/v0001/`, {
        params: { 
            key: API_KEY, 
            steamid: steamId, 
            include_appinfo: 1, // Get game names and images
            include_played_free_games: 1 
        }
    });

    // Handle Private Profiles (Steam won't return games if private)
    if (!gamesRes.data.response.games) {
        return res.status(403).json({ 
            error: "This profile is private. Ask your friend to make their Game Details public!" 
        });
    }

    // Send combined data back to frontend
    res.json({
        user: summaryRes.data.response.players[0],
        games: gamesRes.data.response.games
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Steam API Error" });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));