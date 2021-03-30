import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import SignupFormPage from './components/SignupFormModal/SignupForm';
// import LoginFormPage from "./components/LoginFormPage";
import * as sessionActions from './store/session';
import Navigation from './components/Navigation';
import io from 'socket.io-client';

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
            username: user.username,
            message: messageInput,
        });
        setMessageInput('');
    };

    useEffect(() => {
        socket.on('new user', () => {
            setIsConnected(true);
            console.log('connected');
        });

        socket.emit('connection');
    }, []);

    useEffect(() => {
        dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
    }, [dispatch]);

    return (
        <>
            <Navigation isLoaded={isLoaded} />
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
