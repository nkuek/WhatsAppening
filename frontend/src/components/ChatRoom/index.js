import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import './ChatRoom.css';
const ChatRoom = ({ socket, user }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    const chatRoom = useSelector((state) => state.chatRoom);

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
    return chatRoom ? (
        <>
            <div className="chatRoomContainer">
                <div className="chatRoomHeader">
                    <div className="chatRoomImage"></div>
                    <div className="chatRoomName">{chatRoom.name}</div>
                </div>
                <div>Hi</div>
            </div>
        </>
    ) : (
        <h1>Select or create a chatroom to view messages!</h1>
    );
};

export default ChatRoom;
