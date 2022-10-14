const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const exitHook = require('async-exit-hook');
const config = require('./config');

const app = express();
require('express-ws')(app);

const port = 8000;

app.use(cors());

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
