import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as sessionActions from './store/session';
import { getUserRooms } from './store/chatlist';
import io from 'socket.io-client';
import SideBar from './components/SideBar';

const socket = io('localhost:5000');

function App() {
    const dispatch = useDispatch();
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [isLoaded, setIsLoaded] = useState(false);
    const [messageInput, setMessageInput] = useState('');

    const user = useSelector((state) => state.session.user);

    const handleNewMessage = (e) => {
        e.preventDefault();
        socket.emit('new message', {
            name: user.firstName,
            authorId: user.id,
            body: messageInput,
            chatRoomId: 1,
        });
        setMessageInput('');
    };

    useEffect(() => {
        if (isLoaded && user) dispatch(getUserRooms(user.id));
    }, [isLoaded, user]);

    useEffect(() => {
        socket.on('new user', () => {
            setIsConnected(true);
            console.log('connected');
            dispatch(sessionActions.restoreUser());
            setIsLoaded(true);
        });
        socket.on('created room', (data) => {
            console.log(data.adminId);
            dispatch(getUserRooms(data.adminId));
        });

        socket.emit('connection');
    }, []);

    return (
        <>
            <SideBar isLoaded={isLoaded} socket={socket} />
            <form onSubmit={handleNewMessage}>
                <label>Message</label>
                <input
                    onChange={(e) => setMessageInput(e.target.value)}
                    value={messageInput}
                ></input>
                <button>Send</button>
            </form>
        </>
    );
}

export default App;
