const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const exitHook = require('async-exit-hook');
const config = require('./config');

const users = require('./app/users');
const {nanoid} = require("nanoid");

const app = express();
require('express-ws')(app);

const port = 8000;

app.use(express.static('public'));
app.use(express.json());
app.use(cors());

app.use('/users', users);

const activeConnections = {};

app.ws('/chat', (ws) => {
    const id = nanoid();
    activeConnections[id] = ws;
    console.log('NEW, id =', id);

    ws.on('close', () => {
        console.log('client disconnect');
        delete activeConnections[id];
    });
});

const run = async () => {
    await mongoose.connect(config.mongo.db, config.mongo.options);
    console.log('Mongoose connected!');

    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });

    exitHook(() => {
        mongoose.disconnect();
        console.log('Mongoose disconnected!');
    });
};

run().catch(e => console.error(e));
