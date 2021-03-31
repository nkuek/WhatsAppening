import { Avatar } from '@material-ui/core';
import { useSelector } from 'react-redux';

const ChatList = () => {
    const chatList = useSelector((state) => state.chatList);
    return (
        <div className="chatListContainer">
            {chatList.length > 0 &&
                chatList.map((chat) => (
                    <div className="chatListItem">
                        <div className="chatListImage">
                            <Avatar src={chat.imageUrl} />
                        </div>
                        <div className="chatListInfo">
                            <div className="chatListName">{chat.name}</div>
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default ChatList;
