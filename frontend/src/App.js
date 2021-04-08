import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as sessionActions from './store/session';
import { getUserRooms } from './store/chatlist';
import io from 'socket.io-client';
import SideBar from './components/SideBar';
import ChatRoom from './components/ChatRoom';
import WelcomePage from './components/WelcomePage';
import { findContacts } from './store/userContacts';
import { setSocket, closeSocket } from './store/chatroom';

function App() {
    const dispatch = useDispatch();

    const session = useSelector((state) => state.session);
    const socket = useSelector((state) => state.chatRoom.socket);

    useEffect(() => {
        dispatch(sessionActions.restoreUser());
    }, [dispatch]);

    useEffect(() => {
        if (session.user && session.isLoaded) {
            dispatch(getUserRooms(session.user.id));
            dispatch(findContacts(session.user.id));
            const socket = io(
                process.env.NODE_ENV === 'development'
                    ? 'localhost:5000'
                    : 'https://whatsapp-ening.herokuapp.com/'
            );
            dispatch(setSocket(socket));
        }
        return () => {
            !session.user && dispatch(closeSocket());
        };
    }, [session.user, session.isLoaded, dispatch]);

    useEffect(() => {
        socket &&
            socket.on('created room', (data) => {
                dispatch(getUserRooms(data.adminId));
                socket.emit('update socket', { userId: session.user.id });
            });
    }, [dispatch, socket, session.user]);

    return (
        <>
            {session.user && session.isLoaded ? (
                <>
                    <SideBar />
                    <ChatRoom user={session.user} />
                </>
            ) : (
                <WelcomePage />
            )}
        </>
    );
}

export default App;
