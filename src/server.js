// const path = require('path');
const express = require('express');

const app = express();

// const staticFiles = express.static(path.join(__dirname, '..', '..', 'build'));


app.get('/', (req, res) => {
    console.log('hi')
    res.send('<h1>Hello world</h1>')
})

const port = process.env.PORT || 8000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening on port 'http://localhost:${port}!`);
});
