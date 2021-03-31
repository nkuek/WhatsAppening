import { useState } from 'react';

import './ChatRoom.css';
const ChatRoom = ({ socket, user }) => {
    const [messageInput, setMessageInput] = useState('');
    const handleNewMessage = (e) => {
        e.preventDefault();
        socket.emit('new message', {
            name: user.name,
            authorId: user.id,
            body: messageInput,
            chatRoomId: 1,
        });
        setMessageInput('');
    };
    return (
        <div className="chatRoomContainer">
            <div>Hi</div>
        </div>
    );
};

export default ChatRoom;
