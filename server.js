const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const JAMENDO_CLIENT_ID = '7b33265e'; // Soloina ilay Client ID-nao teo

// API fikarohana mamoaka JSON maivana
app.get('/api/search', async (req, res) => {
    const query = req.query.q || 'gasy';
    try {
        const response = await axios.get(`https://api.jamendo.com/v3.0/tracks/`, {
            params: {
                client_id: JAMENDO_CLIENT_ID,
                format: 'json',
                limit: 10,
                search: query,
                include: 'musicinfo'
            }
        });
        const tracks = response.data.results.map(track => ({
            id: track.id,
            name: track.name,
            artist_name: track.artist_name,
            audio: track.audio
        }));
        res.json(tracks);
    } catch (error) {
        res.status(500).json([]);
    }
});

// Tetezana fampidinana hira mivantana
app.get('/download/:id', async (req, res) => {
    const trackId = req.params.id;
    try {
        const response = await axios.get(`https://api.jamendo.com/v3.0/tracks/`, {
            params: {
                client_id: JAMENDO_CLIENT_ID,
                format: 'json',
                id: trackId
            }
        });
        const track = response.data.results[0];
        if (track && track.audio) {
            // Ampitodihina any amin'ny audio mivantana ny finday
            res.redirect(track.audio);
        } else {
            res.status(404).send('Not Found');
        }
    } catch (error) {
        res.status(500).send('Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
