const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const JAMENDO_CLIENT_ID = '7b33265e'; // Ilay Client ID-nao miasa

app.get('/', async (req, res) => {
    const query = req.query.q || 'gasy';
    let wmlTracks = '';

    try {
        const response = await axios.get('https://api.jamendo.com/v3.0/tracks/', {
            params: {
                client_id: JAMENDO_CLIENT_ID,
                format: 'json',
                limit: 8,
                search: query
            }
        });

        const tracks = response.data.results;
        if (tracks && tracks.length > 0) {
            for (let i = 0; i < tracks.length; i++) {
                let track = tracks[i];
                // Ovaina ho HTTP tsotra ary sivanina ny marika '&' ho an'ny WAP
                let httpAudio = track.audio.replace("https://", "http://");
                let safeAudioUrl = httpAudio.replace(/&/g, "&amp;");
                
                // Kaody WML madio (tahaka ny Waptrick)
                wmlTracks += '<p>' + (i+1) + '. <b>' + track.name + '</b><br/>' +
                             'Artiste: ' + track.artist_name + '<br/>' +
                             '<a href="' + safeAudioUrl + '">[ TELECHARGER ]</a>' +
                             '</p>';
            }
        } else {
            wmlTracks = '<p>Tsy misy hira hita.</p>';
        }
    } catch (error) {
        wmlTracks = '<p>Nisy olana kely ny fikarohana.</p>';
    }

    // TERENA HO WML MIVANTANA (WAP OFISIALY FAHIZAY)
    res.setHeader('Content-Type', 'text/vnd.wap.wml; charset=utf-8');
    
    let wmlResponse = '<?xml version="1.0" encoding="utf-8"?>' +
    '<!DOCTYPE wml PUBLIC "-//WAPFORUM//DTD WML 1.1//EN" "http://www.wapforum.org/DTD/wml_1.1.xml">' +
    '<wml><card id="main" title="WapHira Gasy">' +
    '<p align="center"><b>WapHira Gasy</b><br/><small>Jamendo WML Engine</small></p>' +
    '<p align="center">' +
    'Tadiavina: <input name="q" size="10"/>' +
    '<anchor>[ OK ]<go href="/" method="get"><postfield name="q" value="$(q)"/></go></anchor>' +
    '</p>' +
    '<p><b>Hira azo alaina:</b></p>' +
    wmlTracks +
    '<p align="center"><small>&copy; 2026 Kelitech</small></p>' +
    '</card></wml>';

    res.send(wmlResponse);
});

app.listen(PORT, () => {
    console.log('WML Server running');
});
