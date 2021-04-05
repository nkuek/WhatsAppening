import { Avatar } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { findUserRoom } from '../../../store/chatroom';
import { getUserRooms } from '../../../store/chatlist';
import { socket } from '../../../App';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import './ChatList.css';

dayjs.extend(relativeTime);

const ChatList = () => {
    const dispatch = useDispatch();
    const [selectedItem, setSelectedItem] = useState('');

    const chatList = useSelector((state) => state.chatList);
    const user = useSelector((state) => state.session.user);

    const handleChatListClick = (chatId, chatRoom) => {
        const selectedElement = document.getElementById(selectedItem);
        const clickedChat = document.getElementById(chatId);

        if (selectedItem !== chatId) dispatch(findUserRoom(chatId));

        selectedItem && selectedElement.classList.toggle('selected');
        if (!clickedChat.classList.contains('selected')) {
            clickedChat.classList.toggle('selected');
            selectedItem && selectedElement.classList.remove('selected');
        }
        if (!chatRoom.isRead) {
            socket.emit('read message', { chatRoomId: chatId });
        }

        setSelectedItem(chatId);
    };

    useEffect(() => {
        if (user) {
            socket.on('load messages', () => {
                dispatch(getUserRooms(user.id));
            });
            socket.on('reload chatlist', () => {
                dispatch(getUserRooms(user.id));
            });

            const timer = setInterval(() => {
                dispatch(getUserRooms(user.id));
            }, 60000);

            return () => clearTimeout(timer);
        }
        return;
    }, [user]);

    return (
        <div className="chatListContainer">
            {chatList.length > 0 &&
                chatList.map((chatRoom) => (
                    <div
                        key={chatRoom.id}
                        id={chatRoom.id}
                        onClick={() =>
                            handleChatListClick(chatRoom.id, chatRoom)
                        }
                        className={`chatListItem ${
                            !chatRoom.isRead ? 'unread' : ''
                        } ${chatRoom.id === selectedItem ? 'selected' : ''}`}
                    >
                        <div className="readStatus">
                            {!chatRoom.isRead &&
                                chatRoom.lastMessage.authorId !== user.id && (
                                    <FiberManualRecordIcon
                                        style={{
                                            position: 'relative',
                                            color: '#2878FF',
                                            marginLeft: '5px',
                                            display: 'inline-block',
                                            margin: '0px',
                                        }}
                                    />
                                )}
                        </div>
                        <div className="chatListImage">
                            <Avatar src={chatRoom.imageUrl} />
                        </div>
                        <div className="chatListInfo">
                            <div className="chatListNameAndMessage">
                                <div className="chatListName">
                                    {chatRoom.name}
                                </div>
                                <div className="chatListRecentMessage">
                                    {chatRoom.lastMessage
                                        ? `${chatRoom.lastMessage.author}: ${chatRoom.lastMessage.body}`
                                        : 'This room has no messages yet!'}
                                </div>
                            </div>

                            <div className="chatListRecentMessageTimeContainer">
                                <div className="chatListRecentMessageTime">
                                    {chatRoom.lastMessage &&
                                        `${dayjs(
                                            chatRoom.lastMessage.createdAt
                                        ).fromNow(true)} ago`}
                                </div>
                                <ExpandMoreIcon style={{ marginTop: '10px' }} />
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default ChatList;
