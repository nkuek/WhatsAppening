import { Avatar } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { findUserRoom } from '../../store/chatroom';

const ChatList = () => {
    const dispatch = useDispatch();
    const [selectedItem, setSelectedItem] = useState('');

    const chatList = useSelector((state) => state.chatList);
    const handleChatListClick = (chatId) => {
        dispatch(findUserRoom(chatId));
        document.getElementById(chatId).classList.toggle('selected');
        if (selectedItem)
            document.getElementById(selectedItem).classList.toggle('selected');
        setSelectedItem(chatId);
    };

    useEffect(() => {
        if (chatList.length > 0) {
            const firstChatId = chatList[0].id;
            setSelectedItem(firstChatId);
            document.getElementById(firstChatId).classList.toggle('selected');
            dispatch(findUserRoom(firstChatId));
        }
    }, [chatList]);

    return (
        <div className="chatListContainer">
            {chatList.length > 0 &&
                chatList.map((chatRoom) => (
                    <div
                        key={chatRoom.id}
                        id={chatRoom.id}
                        onClick={() => handleChatListClick(chatRoom.id)}
                        className="chatListItem"
                    >
                        <div className="chatListImage">
                            <Avatar src={chatRoom.imageUrl} />
                        </div>
                        <div className="chatListInfo">
                            <div className="chatListName">{chatRoom.name}</div>
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default ChatList;
