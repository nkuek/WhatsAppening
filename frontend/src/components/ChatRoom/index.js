import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { Avatar, IconButton } from '@material-ui/core';
import { findUserRoom } from '../../store/chatroom';
import InfoIcon from '@material-ui/icons/Info';
import SendIcon from '@material-ui/icons/Send';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

import './ChatRoom.css';
import SentMessage from './SentMessage';
import ReceivedMessage from './ReceivedMessage';
import ChatRoomInfo from './ChatRoomInfo';

const ChatRoom = () => {
    const isMobile = useMediaQuery({ query: '(max-width: 950px)' });
    const dispatch = useDispatch();
    const chatRoom = useSelector((state) => state.chatRoom);
    const socket = useSelector((state) => state.chatRoom.socket);
    const user = useSelector((state) => state.session.user);
    const chatRoomId = useSelector((state) => state.chatRoom.currentRoomId);

    const [messageInput, setMessageInput] = useState('');

    const getParticipantsFirstNames = (participantList) => {
        if (participantList) {
            const firstNames =
                participantList &&
                participantList.map((participant) => {
                    if (participant.id === user.id) return 'You';
                    const fullName = participant.name
                        .split(' ')
                        .filter((name) => !name.includes('.'));
                    return fullName[0];
                });
            if (firstNames.length > 3) {
                const shortenedFirstNames = firstNames
                    .sort((a, b) =>
                        a.toLowerCase() < b.toLowerCase() ? -1 : 1
                    )
                    .slice(0, 3)
                    .join(', ');
                return (
                    shortenedFirstNames + ` + ${firstNames.length - 3} others`
                );
            }
            return firstNames.sort().join(', ');
        }
    };

    useEffect(() => {
        const chatMessageList = document.querySelector('.chatRoomMessageList');
        const chatScrollPosition = sessionStorage.getItem('chatScrollPosition');
        if (chatScrollPosition) chatMessageList.scrollTop = chatScrollPosition;
        else chatMessageList.scrollTop = chatMessageList.scrollHeight;
    }, [chatRoom.room]);

    useEffect(() => {
        socket &&
            socket.on('load messages', (data) => {
                if (chatRoomId === data.chatRoomId)
                    dispatch(findUserRoom(data.chatRoomId));
            });
        return () => socket && socket.off('load messages');
    }, [socket, dispatch, chatRoomId]);

    const handleNewMessage = (e) => {
        e.preventDefault();
        if (!messageInput) return;
        socket &&
            socket.emit('new message', {
                name: user.name,
                authorId: user.id,
                body: messageInput,
                chatRoomId: chatRoom.room.id,
            });
        setMessageInput('');
    };

    const handleShowChatRoomInfo = () => {
        if (isMobile)
            document.querySelector('.chatRoomContainer').classList.add('hide');
        document
            .querySelector('.chatRoomInfoContainer')
            .classList.add('display');
    };

    // Mobile Only
    const handleBackToChatList = (e) => {
        e.stopPropagation();
        document.querySelector('.sidebarContainer').classList.remove('hide');
    };

    return chatRoom.isLoaded ? (
        <>
            <div className={`chatRoomContainer ${isMobile ? 'mobile' : ''}`}>
                <header
                    onClick={handleShowChatRoomInfo}
                    style={{ cursor: 'pointer' }}
                    className="chatRoomHeader"
                >
                    <div className="chatRoomImageAndName">
                        {isMobile && (
                            <IconButton
                                style={{ padding: '8px' }}
                                onClick={handleBackToChatList}
                            >
                                <KeyboardBackspaceIcon
                                    style={{ color: 'white' }}
                                />
                            </IconButton>
                        )}
                        <div className="chatRoomImage">
                            <Avatar
                                src={
                                    chatRoom.room.imageUrl &&
                                    chatRoom.room.imageUrl
                                }
                            />
                        </div>
                        <div
                            className={`chatRoomNameContainer ${
                                isMobile ? 'mobile' : ''
                            }`}
                        >
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
                        <IconButton onClick={handleShowChatRoomInfo}>
                            <InfoIcon style={{ color: 'white' }} />
                        </IconButton>
                    </div>
                </header>
                <div className="chatRoomMessageList">
                    {chatRoom.room.messages &&
                    chatRoom.room.messages.length === 0 ? (
                        <div className="noMessagesContainer">
                            <div className="callToAction2">
                                This room has no messages yet!
                            </div>
                        </div>
                    ) : (
                        chatRoom.room.messages &&
                        chatRoom.room.messages
                            .slice(0)
                            .reverse()
                            .map((message) =>
                                user.id === message.authorId ? (
                                    <SentMessage
                                        key={message.id}
                                        message={message}
                                    />
                                ) : (
                                    <ReceivedMessage
                                        key={message.id}
                                        message={message}
                                    />
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
                                    position: 'absolute',
                                    right: '12%',
                                    top: '17px',
                                    cursor: 'pointer',
                                }}
                            />
                        </div>
                    </form>
                </footer>
            </div>
            <div
                className={`chatRoomInfoContainer ${isMobile ? 'mobile' : ''}`}
            >
                <ChatRoomInfo chatRoom={chatRoom.room} />
            </div>
        </>
    ) : (
        <div
            className={`chatRoomMessageList noMessagesContainer ${
                isMobile ? 'mobile' : ''
            }`}
        >
            <h1>Select or create a chatroom to view messages!</h1>
        </div>
    );
};

export default ChatRoom;
