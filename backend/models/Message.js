const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    datetime: {
        type: String,
        required: true,
    }
});

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
