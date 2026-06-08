const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const JAMENDO_CLIENT_ID = '7b33265e';

app.get('/', async (req, res) => {
    const query = req.query.q || 'gasy';
    let tracksHtml = '';

    try {
        const response = await axios.get('https://api.jamendo.com/v3.0/tracks/', {
            params: {
                client_id: JAMENDO_CLIENT_ID,
                format: 'json',
                limit: 10,
                search: query
            }
        });

        const tracks = response.data.results;
        if (tracks && tracks.length > 0) {
            for (let i = 0; i < tracks.length; i++) {
                let track = tracks[i];
                let httpAudio = track.audio.replace("https://", "http://");
                let safeAudioUrl = httpAudio.replace(/&/g, "&amp;");
                
                // HTML tsotra be tsy misy CSS mavesatra
                tracksHtml += '<p>' +
                              '<b>' + track.name + '</b><br/>' +
                              'Artiste: ' + track.artist_name + '<br/>' +
                              '<a href="' + safeAudioUrl + '">[ TELECHARGER ]</a>' +
                              '</p><hr/>';
            }
        } else {
            tracksHtml = '<p>Tsy misy hira hita.</p>';
        }
    } catch (error) {
        tracksHtml = '<p>Nisy olana kely.</p>';
    }

    // NY MAJIKA: Terena ho "text/html" tsotra fa tsy "xhtml+xml" mba tsy hanao Erreur Inconnu intsony
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    
    // Nesorina koa ilay andalana <?xml version...?> teo aloha satria misy finday kely tsy mahazaka azy
    let htmlResponse = '<html><head><title>WapHira Gasy</title></head>' +
    '<body bgcolor="#003366" text="#ffffff">' +
    '<center>' +
    '<h2>WapHira Gasy</h2>' +
    '<font size="2">Jamendo MP3 WAP</font>' +
    '<br/><br/>' +
    '<form action="/" method="get">' +
    'Tadiavina: <input type="text" name="q" value="' + (query === 'gasy' ? '' : query) + '" size="10"/>' +
    '<input type="submit" value="OK"/>' +
    '</form>' +
    '</center>' +
    '<br/>' +
    '<font color="#000000">' +
    '<table bgcolor="#ffffff" width="100%"><tr><td>' +
    '<b>Hira azo alaina:</b><br/>' +
    tracksHtml +
    '</td></tr></table>' +
    '</font>' +
    '<br/>' +
    '<center><font size="1">&copy; 2026 - Kelitech</font></center>' +
    '</body></html>';

    res.send(htmlResponse);
});

app.listen(PORT, () => {
    console.log('Server running');
});
