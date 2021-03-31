import { useSelector } from 'react-redux';

const ChatList = () => {
    const chatRooms = useSelector((state) => state.chatRooms);
    return (
        <div className="chatListContainer">
            {chatRooms.length > 0 &&
                chatRooms.map((chatRoom) => <div>{chatRoom.name}</div>)}
        </div>
    );
};

export default ChatList;
