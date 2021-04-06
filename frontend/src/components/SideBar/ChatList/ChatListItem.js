import { useState } from 'react';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { Avatar } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChatListDropdown from './ChatListDropdown';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const ChatListItem = ({
    chatRoom,
    showDropdownMenu,
    setShowDropdownMenu,
    handleChatListClick,
    selectedItem,
    setSelectedItem,
    user,
}) => {
    const [chatListHover, setChatListHover] = useState(false);

    return (
        <div
            key={chatRoom.id}
            id={chatRoom.id}
            onMouseEnter={() => setChatListHover(true)}
            onMouseLeave={() => {
                if (!showDropdownMenu) setChatListHover(false);
            }}
            onClick={() => handleChatListClick(chatRoom.id, chatRoom)}
            className={`chatListItem ${!chatRoom.isRead ? 'unread' : ''} ${
                chatRoom.id === selectedItem ? 'selected' : ''
            }`}
        >
            <div className="readStatus">
                {!chatRoom.isRead &&
                    chatRoom.lastMessage &&
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
                    <div className="chatListName">{chatRoom.name}</div>
                    <div className="chatListRecentMessage">
                        {chatRoom.lastMessage
                            ? `${chatRoom.lastMessage.author}: ${chatRoom.lastMessage.body}`
                            : 'This room has no messages yet!'}
                    </div>
                </div>

                <div className="chatListRecentMessageTimeContainer">
                    <div className="chatListRecentMessageTime">
                        {chatRoom.lastMessage &&
                            `${dayjs(chatRoom.lastMessage.createdAt).fromNow(
                                true
                            )} ago`}
                    </div>
                </div>
            </div>
            <span
                className="chatListDropdown"
                onMouseEnter={() => setChatListHover(true)}
                onMouseLeave={() => {
                    if (!showDropdownMenu) setChatListHover(false);
                }}
            >
                {chatListHover && (
                    <ChatListDropdown
                        chatRoomId={chatRoom.id}
                        showDropdownMenu={showDropdownMenu}
                        setShowDropdownMenu={setShowDropdownMenu}
                        setChatListHover={setChatListHover}
                        setSelectedItem={setSelectedItem}
                    />
                )}
            </span>
        </div>
    );
};

export default ChatListItem;
