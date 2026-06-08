const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Ny Client ID Jamendo-nao
const CLIENT_ID = '7b33265e';

app.get('/', async (req, res) => {
    let search_query = req.query.q || '';
    let hira_html = '';

    // Raha misy mpanoratra na hira tadiavina
    if (search_query.trim() !== '') {
        try {
            const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=15&search=${encodeURIComponent(search_query)}`;
            const response = await axios.get(url);
            const tracks = response.data.results;

            if (tracks && tracks.length > 0) {
                tracks.forEach(track => {
                    hira_html += `
                    <div style="padding:8px 0; border-bottom:1px dashed #bbb;">
                        <span style="color:#003366; font-weight:bold;">${track.name}</span><br/>
                        <small style="color:#555;">Artiste : ${track.artist_name}</small><br/>
                        <a href="${track.audio}" style="display:inline-block; margin-top:5px; padding:4px 10px; background-color:#00ff00; color:#000000; text-decoration:none; font-weight:bold; font-size:12px; border-radius:3px;">
                            Télécharger (MP3)
                        </a>
                    </div>`;
                });
            } else {
                hira_html = '<p style="color:red;"><small>Désolé, aucun morceau trouvé pour ce terme.</small></p>';
            }
        } catch (error) {
            hira_html = '<p style="color:red;"><small>Erreur de connexion avec l\'API Jamendo.</small></p>';
        }
    } else {
        hira_html = '<p style="text-align:center; color:#666; margin-top:20px;"><small>Entrez un mot-clé ci-dessus pour rechercher et télécharger des musiques gratuites.</small></p>';
    }

    // Ilay endrika manga sy mavo namboarinao teo amin'ny Wapka, voadika amin'ny XHTML madio
    const pejy_manontolo = `
    <!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.0//EN" "http://www.wapforum.org/DTD/xhtml-mobile10.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>WapHira Gasy - Jamendo</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:sans-serif;">

    <div style="background-color:#003366; padding:15px; text-align:center; color:#ffffff;">
        <h2 style="margin:0; color:#ffff00;"><b>WapHira Gasy</b></h2>
        <p style="color:#00ff00; margin:5px 0 15px 0;"><small>Téléchargement Mp3 Direct et Gratuit</small></p>

        <form action="/" method="get">
            <input type="text" name="q" value="${search_query.replace(/"/g, '&quot;')}" placeholder="Rechercher un artiste, titre..." style="padding:6px; width:80%; max-width:250px; border:1px solid #ffffff; border-radius:4px;" /><br/><br/>
            <input type="submit" value="RECHERCHER" style="padding:8px 20px; background-color:#ffff00; color:#000000; font-weight:bold; border:none; border-radius:4px; cursor:pointer;" />
        </form>
    </div>

    <div style="padding:10px; background-color:#ffff00; color:#000000; text-align:center;">
        <marquee><small>Bienvenue sur votre site de musique! Entrez le nom d'une chanson ci-dessus.</small></marquee>
    </div>

    <div style="padding:10px;">
        ${search_query ? `<h3 style="color:#003366; margin-top:5px;">Résultats pour : "${search_query}"</h3><hr style="border:0; border-top:1px solid #ccc;"/>` : ''}
        ${hira_html}
    </div>

    <div style="background-color:#003366; color:#ffffff; text-align:center; padding:10px; margin-top:20px;">
        <p style="margin:0;"><small>&copy; 2026 - Kelitech Platform</small></p>
    </div>

    </body>
    </html>`;

    res.send(pejy_manontolo);
});

app.listen(PORT, () => {
    console.log(`Server mandeha amin'ny port ${PORT}`);
});
