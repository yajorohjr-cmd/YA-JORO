const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const JAMENDO_CLIENT_ID = '7b33265e'; // Ny Client ID-nao efa miasa tsara

// 1. API FIKAROHANA MAMOAKA JSON MAIVANA FO RAHA HO AN'NY WAP
app.get('/api/search', async (req, res) => {
    const query = req.query.q || 'gasy';
    try {
        const response = await axios.get(`https://api.jamendo.com/v3.0/tracks/`, {
            params: {
                client_id: JAMENDO_CLIENT_ID,
                format: 'json',
                limit: 10,
                search: query
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

// 2. TETEZA-MAMPIHOATRA NY AUDIO HO AN'ILAY FINDAY KELY (STREAM)
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
            // Ampitodihina mivantana any amin'ny rohy audio ny finday
            res.redirect(track.audio);
        } else {
            res.status(404).send('Hira tsy hita');
        }
    } catch (error) {
        res.status(500).send('Erreur server');
    }
});

app.listen(PORT, () => {
    console.log(`Server mandeha tsara amin'ny port ${PORT}`);
});
