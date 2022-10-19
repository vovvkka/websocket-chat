import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import {Button, Grid, TextField, Typography} from "@mui/material";
import Message from "../../components/Message/Message";
import './Chat.css';

const Chat = () => {
    const ws = useRef(null);
    const user = useSelector(state => state.users.user);

    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [onlineUsers, setOnlineUsers] = useState([]);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/chat?token=' + user.token);

        ws.current.onmessage = event => {
            const decodedMessage = JSON.parse(event.data);

            if (decodedMessage.type === 'CONNECTED') {
                setMessages(decodedMessage.data.messages);
                setOnlineUsers(decodedMessage.data.onlineUsers);
            }

            if (decodedMessage.type === 'NEW_MESSAGE') {
                setMessages(prevState => ([
                    ...prevState,
                    decodedMessage.data
                ]));
            }

            if (decodedMessage.type === 'CHANGE_ONLINE_LIST') {
                setOnlineUsers(decodedMessage.data.onlineUsers);
            }

            if (decodedMessage.type === 'DELETED_MESSAGE') {
                setMessages(prev => ([
                    ...prev.filter(msg => msg._id !== decodedMessage.data)
                ]));
            }
        };

        return () => {
            ws.current.close();
        };
    }, [user.token]);

    const sendMessage = e => {
        e.preventDefault();

        ws.current.send(JSON.stringify({
            type: 'CREATE_MESSAGE',
            data: {
                author: user.token,
                message: messageText
            }
        }));

        setMessageText('');
    };

    const deleteMessage = id => {
        ws.current.send(JSON.stringify({
            type: 'DELETE_MESSAGE',
            data: {id}
        }));
    };

    return (
        <Grid container justifyContent='center' sx={{flexWrap: 'nowrap'}}>
            <div className='online'>
                <Typography variant='h4'>Online users</Typography>
                {onlineUsers.map((user, idx) => (
                    <p key={user + idx}>{user.user}</p>
                ))}
            </div>
            <div className='chat-block'>
                <div className='chat'>
                    <Typography variant='h4'>Chat room</Typography>
                </div>
                <div className='messages'>
                    {
                        messages.map(msg => (
                            <Message
                                key={msg._id + msg.author.username}
                                role={user.role}
                                user={msg.author.username}
                                message={msg.message}
                                onDelete={() => deleteMessage(msg._id)}
                            />
                        ))
                    }
                    <div ref={messagesEndRef}/>
                </div>
                <form onSubmit={sendMessage}>
                    <Grid container alignItems='center'>
                        <TextField
                            fullWidth={false}
                            label='Message'
                            sx={{marginX: '20px'}}
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                        />
                        <Button variant='contained' size='large' type='submit'>Send</Button>
                    </Grid>
                </form>
            </div>
        </Grid>
    );
};

export default Chat;