import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as sessionActions from './store/session';
import { getUserRooms } from './store/chatlist';
import io from 'socket.io-client';
import SideBar from './components/SideBar';
import ChatRoom from './components/ChatRoom';
import WelcomePage from './components/WelcomePage';

export const socket = io(
    process.env.NODE_ENV === 'development'
        ? 'localhost:5000'
        : 'https://whatsapp-ening.herokuapp.com/'
);

function App() {
    const dispatch = useDispatch();

    const session = useSelector((state) => state.session);

    useEffect(() => {
        if (session.user && session.isLoaded) {
            dispatch(getUserRooms(session.user.id));
        }
    }, [session, dispatch]);

    useEffect(() => {
        socket.on('new user', () => {
            dispatch(sessionActions.restoreUser());
        });
        socket.on('created room', (data) => {
            dispatch(getUserRooms(data.adminId));
        });

        socket.emit('connection');
    }, [dispatch]);

    return (
        <>
            {session.user && session.isLoaded ? (
                <>
                    <SideBar socket={socket} />
                    <ChatRoom socket={socket} user={session.user} />
                </>
            ) : (
                <WelcomePage />
            )}
        </>
    );
}

export default App;
