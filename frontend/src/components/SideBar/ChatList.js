import { Avatar } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { findUserRoom } from '../../store/chatroom';

const ChatList = () => {
    const dispatch = useDispatch();

    const chatList = useSelector((state) => state.chatList);
    const handleChatListClick = (chatId) => {
        dispatch(findUserRoom(chatId));
    };
    return (
        <div className="chatListContainer">
            {chatList.length > 0 &&
                chatList.map((chatRoom) => (
                    <div
                        key={chatRoom.id}
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
