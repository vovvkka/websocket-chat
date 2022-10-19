const mongoose = require('mongoose');
const {nanoid} = require('nanoid');
const config = require('./config');

const User = require('./models/User');
const Message = require("./models/Message");

const run = async () => {
    await mongoose.connect(config.mongo.db);

    const collections = await mongoose.connection.db.listCollections().toArray();

    for (const coll of collections) {
        await mongoose.connection.db.dropCollection(coll.name);
    }

    const [admin, user] = await User.create({
        username: 'admin',
        password: 'admin',
        token: nanoid(),
        role: 'moderator',
    }, {
        username: 'user',
        password: 'user',
        token: nanoid(),
        role: 'user',
    });

    await Message.create({
        author: admin._id,
        message: 'Hello, world',
        datetime: '12:23:09 AM'
    }, {
        author: admin._id,
        message: 'Dead chat..:(',
        datetime: '13:11:28 PM'
    }, {
        author: user._id,
        message: 'I`m here)',
        datetime: '13:12:02 PM'
    });

    await mongoose.connection.close();
};

run().catch(console.error);