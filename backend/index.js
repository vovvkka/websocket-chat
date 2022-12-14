const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const exitHook = require('async-exit-hook');
const config = require('./config');

const users = require('./app/users');
const {nanoid} = require("nanoid");
const dayjs = require('dayjs');
const Message = require("./models/Message");
const User = require("./models/User");

const app = express();
require('express-ws')(app);

const port = 8000;

app.use(express.static('public'));
app.use(express.json());
app.use(cors());

app.use('/users', users);

const activeConnections = {};
let onlineUsers = [];

app.ws('/chat', async (ws, req) => {
    const id = nanoid();
    console.log('Client connected id=', id);
    activeConnections[id] = ws;

    let messages = [];
    let user = await User.findOne({token: req.query.token});

    if (!onlineUsers.find(onlineUser => onlineUser.user === user.username)) {
        onlineUsers = [...onlineUsers, {user: user.username, sessions: 1}];
    } else {
        const index = onlineUsers.findIndex(onlineUser => onlineUser.user === user.username);
        onlineUsers[index].sessions += 1;
    }

    if (!user) {
        console.log('User not found!');
        delete activeConnections[id];
    }

    try {
        messages = await Message
            .find()
            .sort({datetime: 1})
            .limit(30)
            .populate('author', 'username');
    } catch (e) {
        console.error(e);
    }

    ws.send(JSON.stringify({
        type: 'CONNECTED',
        data: {messages, onlineUsers},
    }));

    Object.keys(activeConnections).forEach(connId => {
        const conn = activeConnections[connId];

        conn.send(JSON.stringify({
            type: 'CHANGE_ONLINE_LIST',
            data: {onlineUsers},
        }));
    });

    ws.on('close', () => {
        console.log('Client disconnected! id=', id);
        delete activeConnections[id];

        const deletingUser = onlineUsers.find(onlineUser => onlineUser.user === user.username);
        const deletingUserIndex = onlineUsers.findIndex(onlineUser => onlineUser.user === user.username);

        if (deletingUser?.sessions >= 2) {
            onlineUsers[deletingUserIndex].sessions -= 1;
            return;
        }

        onlineUsers = onlineUsers.filter(onlineUser => onlineUser.user !== deletingUser.user);

        Object.keys(activeConnections).forEach(connId => {
            const conn = activeConnections[connId];

            conn.send(JSON.stringify({
                type: 'CHANGE_ONLINE_LIST',
                data: {onlineUsers},
            }));
        });
    });

    ws.on('message', async msg => {
        const decodedMessage = JSON.parse(msg);

        switch (decodedMessage.type) {
            case 'CREATE_MESSAGE':
                try {
                    const newMessage = await new Message({
                        author: user._id,
                        message: decodedMessage.data.message,
                        datetime: dayjs().format('h:mm:ss A')
                    }).populate('author', 'username');

                    await newMessage.save();

                    Object.keys(activeConnections).forEach(connId => {
                        const conn = activeConnections[connId];

                        conn.send(JSON.stringify({
                            type: 'NEW_MESSAGE',
                            data: newMessage
                        }));
                    });
                } catch (e) {
                    console.error(e);
                }
                break;

            case 'DELETE_MESSAGE':
                if (user.role !== 'moderator') {
                    console.log('You dont have rights!');
                    return;
                }

                try {
                    await Message.deleteOne({_id: decodedMessage.data.id});

                    Object.keys(activeConnections).forEach(connId => {
                        const conn = activeConnections[connId];

                        conn.send(JSON.stringify({
                            type: 'DELETED_MESSAGE',
                            data: decodedMessage.data.id
                        }));
                    });
                } catch (e) {
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
