import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from "react-redux";

const Chat = () => {
    const ws = useRef(null);
    const user = useSelector(state => state.users.user);

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000');

        ws.current.onmessage = event => {
            const decodedMessage = JSON.parse(event.data);

            if (decodedMessage.type === 'CONNECTED') {
                setMessages(decodedMessage.data.messages);
            }

            if (decodedMessage.type === 'NEW_MESSAGE') {
                setMessages(prevState => ([
                    ...prevState,
                    decodedMessage.data
                ]));
            }
        };

        return () => {
            ws.current.close();
        }
    }, []);

    const sendMessage = () => {
        ws.current.send(JSON.stringify({
            type: 'SEND_MESSAGE',
            data: {
                author: user._id,
                message: 'Message text'
            }
        }));
    };

    return (
        <div>
            <button onClick={sendMessage}>Test message sending by socket</button>
            Chat:
            {messages.map(item => <div key={item._id}>{item.author.username}: {item.message} </div>)}
        </div>
    );
};

export default Chat;