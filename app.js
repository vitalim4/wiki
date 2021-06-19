const url = require('./config.js');
const request = require('request');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/api/topics', (req, res) => {
    if (!req.query.search) {
        res.status(400).json({
            error: 'You must provide query params!'
        })
    }
    else {
        const queryParams = `?action=opensearch&search=${req.query.search}`
        const baseUrl = url + queryParams;
        request({
            url: baseUrl,
        }, (error, response) => {
            if (error) {
                res.status(500).json(error);
            }
            else if (response.body.error) {
                res.status(500).json(error)
            }
            else {
                const data = JSON.parse(response.body);
                res.json(data);
            }
        });
    }

});

app.get('/api/topic/context', (req, res) => {
    if (!req.query.title) {
        res.status(400).json({
            error: 'You must provide query params!'
        })
    }
    else {
        const queryParams = `?action=query&prop=extracts&format=json&exintro=&titles=${req.query.title}`;
        const baseUrl = url + queryParams;
        request(
            {
                url: baseUrl,
            }, (error, response) => {
                if (error) {
                    res.json(error);
                }
                else if (response.body.error) {
                    res.json(error)
                }
                else {
                    const data = JSON.parse(response.body);
                    res.json(data);
                }
            });
    }

});

app.listen(3000, () => {
    console.log('Server is up on port 3000');
});

module.exports = app;