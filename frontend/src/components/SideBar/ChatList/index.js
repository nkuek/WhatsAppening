import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { findUserRoom } from '../../../store/chatroom';
import { getUserRooms } from '../../../store/chatlist';
import { socket } from '../../../App';

import './ChatList.css';
import ChatListItem from './ChatListItem';

const ChatList = () => {
    const dispatch = useDispatch();
    const [selectedItem, setSelectedItem] = useState('');
    const [showDropdownMenu, setShowDropdownMenu] = useState(false);

    const chatList = useSelector((state) => state.chatList);
    const user = useSelector((state) => state.session.user);

    const handleChatListClick = (chatId, chatRoom) => {
        const selectedElement = document.getElementById(selectedItem);
        const clickedChat = document.getElementById(chatId);

        if (selectedItem !== chatId) dispatch(findUserRoom(chatId));

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
            socket.emit('read message', { chatRoomId: chatId });
        }

        setSelectedItem(chatId);
        sessionStorage.removeItem('chatScrollPosition');
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
                    <ChatListItem
                        key={chatRoom.id}
                        chatRoom={chatRoom}
                        showDropdownMenu={showDropdownMenu}
                        setShowDropdownMenu={setShowDropdownMenu}
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
