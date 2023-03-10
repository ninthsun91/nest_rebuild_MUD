const express = require('express');
const ejs = require('ejs');
const path = require('path');

const app = express();
const PORT = process.env.WEB_PORT || 8080;

app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views', 'public')));

app.use(express.json());
app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': req.headers.origin,
        'Access-Control-Allow-Methods': 'GET, POST',
        'Access-Control-Allow-Headers': '',
    });
    next();
});

app.get('/', (req, res) => {
    res.status(200).render('index.html');
});

app.listen(PORT, () => {
    console.log(`WEB SERVER RUNNING ON ${PORT}`);
});
