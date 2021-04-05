import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, IconButton } from '@material-ui/core';
import { findUserRoom } from '../../store/chatroom';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import SendIcon from '@material-ui/icons/Send';

import './ChatRoom.css';
import SentMessage from './SentMessage';
import ReceivedMessage from './ReceivedMessage';
const ChatRoom = ({ socket, user }) => {
    const dispatch = useDispatch();
    const chatRoom = useSelector((state) => state.chatRoom);

    const [messageInput, setMessageInput] = useState('');

    const getParticipantsFirstNames = (participantList) => {
        if (participantList) {
            const firstNames =
                participantList &&
                participantList.map(
                    (participant) => participant.name.split(' ')[0]
                );
            return firstNames.join(', ');
        }
    };

    useEffect(() => {
        const chatMessageList = document.querySelector('.chatRoomMessageList');
        const chatScrollPosition = sessionStorage.getItem('chatScrollPosition');
        socket.on('load messages', (data) => {
            if (chatScrollPosition)
                chatMessageList.scrollTop = chatScrollPosition;
            else chatMessageList.scrollTop = chatMessageList.scrollHeight;
            dispatch(findUserRoom(data.chatRoomId));
        });
    }, [socket, dispatch]);

    useEffect(() => {
        const chatMessageList = document.querySelector('.chatRoomMessageList');
        const chatScrollPosition = sessionStorage.getItem('chatScrollPosition');
        if (chatScrollPosition) chatMessageList.scrollTop = chatScrollPosition;
        else chatMessageList.scrollTop = chatMessageList.scrollHeight;
    }, [chatRoom.room]);

    // useEffect(() => {
    //     const chatMessageList = document.querySelector('.chatRoomMessageList');
    //     const loadMore = () => {
    //         if (chatRoom.room && chatMessageList.scrollTop === 0) {
    //             setTimeout(() => {
    //                 dispatch(findUserRoom(chatRoom.room.id));
    //             }, 500);
    //         }
    //     };
    //     chatMessageList.addEventListener('scroll', loadMore);
    //     return () => chatMessageList.removeEventListener('scroll', loadMore);
    // }, [chatRoom]);

    const handleNewMessage = (e) => {
        e.preventDefault();
        if (!messageInput) return;
        socket.emit('new message', {
            name: user.name,
            authorId: user.id,
            body: messageInput,
            chatRoomId: chatRoom.room.id,
        });
        setMessageInput('');
    };
    return chatRoom.isLoaded ? (
        <>
            <div className="chatRoomContainer">
                <header className="chatRoomHeader">
                    <div className="chatRoomImageAndName">
                        <div className="chatRoomImage">
                            <Avatar
                                src={
                                    chatRoom.room.imageUrl &&
                                    chatRoom.room.imageUrl
                                }
                            />
                        </div>
                        <div className="chatRoomNameContainer">
                            <div className="chatRoomName">
                                {chatRoom.room.name}
                            </div>
                            <div className="chatRoomParticipants">
                                {getParticipantsFirstNames(
                                    chatRoom.room.participants
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="chatRoomAddParticipant">
                        <IconButton>
                            <GroupAddIcon style={{ color: 'white' }} />
                        </IconButton>
                    </div>
                </header>
                <div className="chatRoomMessageList">
                    {chatRoom.room.messages &&
                    chatRoom.room.messages.length === 0 ? (
                        <div className="noMessagesContainer">
                            <div className="callToAction1">
                                This room has no messages yet!
                            </div>
                        </div>
                    ) : (
                        chatRoom.room.messages &&
                        chatRoom.room.messages.map((message) =>
                            user.id === message.authorId ? (
                                <SentMessage message={message} />
                            ) : (
                                <ReceivedMessage message={message} />
                            )
                        )
                    )}
                </div>
                <footer className="chatRoomMessageFooter">
                    <form
                        onSubmit={handleNewMessage}
                        className="chatRoomMessageForm"
                    >
                        <div className="chatRoomMessageInputContainer">
                            <input
                                value={messageInput}
                                onChange={(e) =>
                                    setMessageInput(e.target.value)
                                }
                                placeholder="Type a message"
                                className="chatRoomMessageInput"
                            ></input>
                            <SendIcon
                                onClick={handleNewMessage}
                                style={{
                                    color: '#2878FF',
                                    position: 'relative',
                                    right: '40px',
                                    top: '8px',
                                    cursor: 'pointer',
                                }}
                            />
                        </div>
                    </form>
                </footer>
            </div>
        </>
    ) : user ? (
        <div className="chatRoomMessageList noMessagesContainer">
            <h1>Select or create a chatroom to view messages!</h1>
        </div>
    ) : (
        <div className="chatRoomMessageList noMessagesContainer">
            <div className="welcomeMessage">
                <div className="callToAction1">Welcome!</div>
                <div className="callToAction2">
                    Signup or login to find out WhatsAppening
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;
