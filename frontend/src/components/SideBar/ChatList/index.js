import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { findUserRoom } from '../../../store/chatroom';
import { getUserRooms } from '../../../store/chatlist';

import './ChatList.css';
import ChatListItem from './ChatListItem';

const ChatList = () => {
    const dispatch = useDispatch();
    const [selectedItem, setSelectedItem] = useState('');

    const chatList = useSelector((state) => state.chatList);
    const user = useSelector((state) => state.session.user);
    const chatRoom = useSelector((state) => state.chatRoom);
    const socket = useSelector((state) => state.chatRoom.socket);

    const handleChatListClick = (chatId, chatRoom) => {
        const selectedElement = document.getElementById(selectedItem);
        const clickedChat = document.getElementById(chatId);

        dispatch(findUserRoom(chatId));

        selectedItem &&
            selectedElement &&
            selectedElement.classList.toggle('selected');
        if (!clickedChat.classList.contains('selected')) {
            clickedChat.classList.toggle('selected');
            selectedItem &&
                selectedElement &&
                selectedElement.classList.remove('selected');
        }
        if (!chatRoom.isRead) {
            socket && socket.emit('read message', { chatRoomId: chatId });
        }

        setSelectedItem(chatId);
        sessionStorage.removeItem('chatScrollPosition');
    };

    useEffect(() => {
        if (chatRoom.isLoaded && user) dispatch(getUserRooms(user.id));
    }, [user, chatRoom.isLoaded, dispatch]);

    useEffect(() => {
        if (user) {
            socket &&
                socket.on('load messages', () => {
                    dispatch(getUserRooms(user.id));
                });
            socket &&
                socket.on('reload chatlist', () => {
                    dispatch(getUserRooms(user.id));
                });

            const timer = setInterval(() => {
                dispatch(getUserRooms(user.id));
            }, 60000);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [user, dispatch, socket]);

    return (
        <div className="chatListContainer">
            {chatList.length > 0 &&
                chatList.map((chatRoom) => (
                    <ChatListItem
                        key={chatRoom.id}
                        chatRoom={chatRoom}
                        handleChatListClick={handleChatListClick}
                        selectedItem={selectedItem}
                        setSelectedItem={setSelectedItem}
                        user={user}
                    />
                ))}
        </div>
    );
};

export default ChatList;
