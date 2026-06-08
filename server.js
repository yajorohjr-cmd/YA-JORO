const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const JAMENDO_CLIENT_ID = '7b33265e'; // Ilay Client ID-nao efa miasa

// 1. PEJY LEHIBE HO AN'ILAY FINDAY KELY WAP NA ANDROID
app.get('/', async (req, res) => {
    const query = req.query.q || 'gasy';
    let tracksHtml = '';

    try {
        // Maka hira avy amin'ny Jamendo
        const response = await axios.get(`https://api.jamendo.com/v3.0/tracks/`, {
            params: {
                client_id: JAMENDO_CLIENT_ID,
                format: 'json',
                limit: 12,
                search: query
            }
        });

        const tracks = response.data.results;
        if (tracks && tracks.length > 0) {
            tracks.forEach(track => {
                // Ovaina ho HTTP tsotra ny rohy audio mba ho zakan'ilay finday kely tsy misy crash
                const httpAudio = track.audio.replace("https://", "http://");
                tracksHtml += `
                <div style="border-bottom:1px dashed #000; padding:5px 0;">
                    - <b>${track.name}</b><br/>
                    <small>Artiste: ${track.artist_name}</small><br/>
                    <a href="${httpAudio}" style="color:blue; font-weight:bold;">[ TELECHARGER ]</a>
                </div>`;
            });
        } else {
            tracksHtml = '<p style="color:red;"><small>Tsy misy hira hita.</small></p>';
        }
    } catch (error) {
        tracksHtml = '<p style="color:red;"><small>Nisy olana kely ny fikarohana.</small></p>';
    }

    // Mamoaka ny endrika XHTML Mobile ofisialy vakin'ilay finday kely
    res.setHeader('Content-Type', 'application/xhtml+xml; charset=utf-8');
    res.send(`<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.0//EN" "http://www.wapforum.org/DTD/xhtml-mobile10.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>WapHira Gasy</title>
</head>
<body style="background-color:#003366; color:#ffffff; font-family:monospace; padding:5px;">
    <div style="text-align:center; background-color:#ffff00; color:#000000; padding:5px;">
        <b>WapHira Gasy</b><br/>
        <small>Jamendo MP3 Render Version</small>
    </div>
    <div style="margin-top:10px; text-align:center;">
        <form action="/" method="get">
            Katsaho:<br/>
            <input type="text" name="q" value="${query === 'gasy' ? '' : query}" size="15" /><br/>
            <input type="submit" value="RECHERCHER" />
        </form>
    </div>
    <div style="margin-top:10px; background-color:#ffffff; color:#000000; padding:5px;">
        <b>${query === 'gasy' ? 'Hira vao mivoaka:' : 'Valiny:'}</b><br/>
        ${tracksHtml}
    </div>
    <div style="text-align:center; margin-top:15px; font-size:x-small;">
        &copy; 2026 - Kelitech WAP via Render
    </div>
</body>
</html>`);
});

app.listen(PORT, () => {
    console.log(`Server mandeha tsara amin'ny port ${PORT}`);
});
