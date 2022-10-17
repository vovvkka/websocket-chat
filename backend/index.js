const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const exitHook = require('async-exit-hook');
const config = require('./config');

const users = require('./app/users');
const {nanoid} = require("nanoid");
const dayjs = require('dayjs');
const Message = require("./models/Message");

const app = express();
require('express-ws')(app);

const port = 8000;

app.use(express.static('public'));
app.use(express.json());
app.use(cors());

app.use('/users', users);

const activeConnections = {};

app.ws('/', async ws => {
    let messages = []
    const id = nanoid();
    console.log('Client connected id=', id);
    activeConnections[id] = ws;

    console.log('Request messages from database for the new connected client');
    try {
        messages = await Message
            .find()
            .sort({ datetime: -1 })
            .limit(20);
        console.log('Successfully received messages for the new client');
    } catch(e) {
        console.error('Error while getting messages for the new client:', e);
    }

    ws.send(JSON.stringify({
        type: 'CONNECTED',
        data: { messages }
    }));

    ws.on('close', () => {
        console.log('Client disconnected! id=', id);
        delete activeConnections[id];
    });

    ws.on('message', async msg => {
        const decodedMessage = JSON.parse(msg);

        switch (decodedMessage.type) {
            case 'SEND_MESSAGE':
                try {
                    const newMessage = await new Message({
                        author: decodedMessage.data.author,
                        message: decodedMessage.data.message,
                        datetime: dayjs().format('h:mm:ss A')
                    });
                    await newMessage.save();
                    Object.keys(activeConnections).forEach(connId => {
                        const conn = activeConnections[connId];
                        conn.send(JSON.stringify({
                            type: 'NEW_MESSAGE',
                            data: newMessage
                        }));
                    });
                } catch(e) {
                    console.error(e);
                }
                break;
            default:
                console.log('Unknown type:', decodedMessage.type);
        }
        ws.send(msg);
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
