import express from 'express';
import fetch from 'node-fetch';

const app = express();

// ejs
app.set("view engine", 'ejs');

// routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/index', async (req, response) => {
    try {
        const params = new URLSearchParams({
            action: "opensearch",
            search: req.query.person,
            limit: "1",
            namespace: "0",
            format: "json"
        });

        const url = `https://en.wikipedia.org/w/api.php?${params}`;

        // Fetch Wikipedia search results
        const searchRes = await fetch(url);
        const result = await searchRes.json();
        
        if (!result[3][0]) {
            return response.status(404).send({ error: 'Person not found' });
        }

        // Get the page title from the URL
        const pageTitle = result[3][0].split('/wiki/')[1];

        // Fetch the page content using the MediaWiki API
        const contentUrl = new URL('https://en.wikipedia.org/w/api.php');
        contentUrl.search = new URLSearchParams({
            action: 'query',
            prop: 'revisions',
            titles: pageTitle,
            rvslots: '*',
            rvprop: 'content',
            format: 'json',
            formatversion: '2'
        });

        const contentRes = await fetch(contentUrl);
        const contentData = await contentRes.json();
        
        // Extract infobox data
        const page = contentData.query.pages[0];
        if (!page || !page.revisions || !page.revisions[0].slots.main.content) {
            return response.status(404).send({ error: 'Content not found' });
        }

        const wikitext = page.revisions[0].slots.main.content;
        const infoboxData = parseInfobox(wikitext);
        
        response.json(infoboxData);

    } catch (err) {
        console.error('Error:', err);
        response.status(500).send({ error: 'Internal server error' });
    }
});

function parseInfobox(wikitext) {
    // Basic infobox parser - you might want to enhance this
    const infoboxRegex = /\{\{Infobox[^}]+\}\}/i;
    const match = wikitext.match(infoboxRegex);
    
    if (!match) {
        return {};
    }

    const infobox = match[0];
    const lines = infobox.split('\n');
    const data = {};

    lines.forEach(line => {
        const parts = line.split('=').map(p => p.trim());
        if (parts.length === 2) {
            // Clean up the value by removing wiki markup
            const value = parts[1]
                .replace(/\[\[([^\]|]+?)(?:\|[^\]]+)?\]\]/g, '$1') // Handle wiki links
                .replace(/''/g, '') // Remove italic markers
                .replace(/{{[^}]+}}/g, ''); // Remove templates
            
            data[parts[0]] = value;
        }
    });

    return data;
}

// port
app.listen(3000, () => console.log("Listening at port 3000..."));

export default app;
