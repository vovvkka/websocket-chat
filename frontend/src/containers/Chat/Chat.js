import React, {useEffect, useRef} from 'react';

const Chat = () => {
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/chat');
    }, []);

    return (
        <div>
            Here will be chat
        </div>
    );
};

export default Chat;