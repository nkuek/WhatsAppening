import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as sessionActions from './store/session';
import { getUserRooms } from './store/chatlist';
import io from 'socket.io-client';
import SideBar from './components/SideBar';

const socket = io('localhost:5000');

function App() {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const [messageInput, setMessageInput] = useState('');

    const user = useSelector((state) => state.session.user);

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
    console.log(isLoaded);

    useEffect(() => {
        if (isLoaded && user) dispatch(getUserRooms(user.id));
    }, [isLoaded, user, dispatch]);

    useEffect(() => {
        socket.on('new user', () => {
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
            {/* <form onSubmit={handleNewMessage}>
                <label>Message</label>
                <input
                    onChange={(e) => setMessageInput(e.target.value)}
                    value={messageInput}
                ></input>
                <button>Send</button>
            </form> */}
        </>
    );
}

export default App;
