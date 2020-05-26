// const path = require('path');
const express = require('express');
const User = require('./models/user')
const app = express();

// const staticFiles = express.static(path.join(__dirname, '..', '..', 'build'));


app.get('/', async (req, res) => {
    console.log('hi', process.env.TEST)
    let user;
    try {
        user = await User.find(1);
    } catch (e) {
        console.log(e)
    }
    res.send(`
        <h1>Hello, World!</h1>
        <h2>First User in db: ${user ? user.name : '' } </h2>
    `)

})

const port = process.env.PORT || 8000;
app.listen(port, '0.0.0.0', () => {
    console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);
    console.log(`Example app listening on port 'http://localhost:${port}!`);
});
