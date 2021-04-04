import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, IconButton } from '@material-ui/core';
import { findUserRoom } from '../../store/chatroom';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import SendIcon from '@material-ui/icons/Send';
import dayjs from 'dayjs';

import './ChatRoom.css';
const ChatRoom = ({ socket, user }) => {
    const dispatch = useDispatch();

    const [messageInput, setMessageInput] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);

    const chatRoom = useSelector((state) => state.chatRoom);

    const getParticipantsFirstNames = (participantList) => {
        const firstNames = participantList.map(
            (participant) => participant.name.split(' ')[0]
        );
        return firstNames.join(', ');
    };

    useEffect(() => {
        socket.on('load messages', (data) => {
            dispatch(findUserRoom(data.chatRoomId));
            const chatMessageList = document.querySelector(
                '.chatRoomMessageList'
            );
            chatMessageList.scrollTop = chatMessageList.scrollHeight;
        });
    }, [socket, dispatch]);

    useEffect(() => {
        if (chatRoom) {
            setIsLoaded(true);
        }
        const chatMessageList = document.querySelector('.chatRoomMessageList');
        chatMessageList.scrollTop = chatMessageList.scrollHeight;
    }, [chatRoom]);

    const handleNewMessage = (e) => {
        e.preventDefault();
        socket.emit('new message', {
            name: user.name,
            authorId: user.id,
            body: messageInput,
            chatRoomId: chatRoom.id,
        });
        setMessageInput('');
    };
    return isLoaded && chatRoom && chatRoom.messages ? (
        <>
            <div className="chatRoomContainer">
                <header className="chatRoomHeader">
                    <div className="chatRoomImageAndName">
                        <div className="chatRoomImage">
                            <Avatar
                                src={chatRoom.imageUrl && chatRoom.imageUrl}
                            />
                        </div>
                        <div className="chatRoomNameContainer">
                            <div className="chatRoomName">{chatRoom.name}</div>
                            <div className="chatRoomParticipants">
                                {getParticipantsFirstNames(
                                    chatRoom.participants
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
                    {chatRoom.messages.length === 0 ? (
                        <div className="noMessagesContainer">
                            <div className="callToAction1">
                                This room has no messages yet!
                            </div>
                        </div>
                    ) : (
                        chatRoom.messages.map((message) =>
                            message.authorId === user.id ? (
                                <div
                                    key={message.id}
                                    className="chatRoomMessageContainer sent"
                                >
                                    <div className="chatRoomMessage sent">
                                        <div className="chatRoomMessageBody">
                                            {message.body}
                                        </div>
                                        <span className="chatRoomMessageTime">
                                            {dayjs(message.createdAt).format(
                                                'HH:mm'
                                            )}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    key={message.id}
                                    className="chatRoomMessageContainer received"
                                >
                                    <div className="chatMessageArrow"></div>
                                    <div className="chatRoomMessage received">
                                        <div className="chatRoomMessageText">
                                            <div className="chatRoomMessageSender">
                                                {message.author}
                                            </div>
                                            <div className="chatRoomMessageBody">
                                                {message.body}
                                            </div>
                                        </div>
                                        <span className="chatRoomMessageTime">
                                            {dayjs(message.createdAt).format(
                                                'HH:mm'
                                            )}
                                        </span>
                                    </div>
                                </div>
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
