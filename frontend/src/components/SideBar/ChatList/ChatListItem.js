import { useState } from 'react';

import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { Avatar } from '@material-ui/core';
import ChatListDropdown from './ChatListDropdown';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const ChatListItem = ({
    chatRoom,
    handleChatListClick,
    selectedItem,
    setSelectedItem,
    user,
}) => {
    const [chatListHover, setChatListHover] = useState(false);
    const [showDropdownMenu, setShowDropdownMenu] = useState(false);

    return (
        <>
            <div
                id={chatRoom.id}
                onMouseEnter={() => setChatListHover(true)}
                onMouseLeave={() => {
                    if (!showDropdownMenu) setChatListHover(false);
                }}
                onClick={() => handleChatListClick(chatRoom.id, chatRoom)}
                className={`chatListItem ${
                    !chatRoom.isRead &&
                    chatRoom.lastMessage &&
                    chatRoom.lastMessage.id !== user.id
                        ? 'unread'
                        : ''
                } ${chatRoom.id === selectedItem ? 'selected' : ''}`}
            >
                <div
                    className="chatListItemContainer"
                    onMouseEnter={() => setChatListHover(true)}
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
                    <div
                        className="chatListImage"
                        onMouseEnter={() => setChatListHover(true)}
                    >
                        <Avatar src={chatRoom.imageUrl} />
                    </div>
                    <div
                        className="chatListInfo"
                        onMouseEnter={() => setChatListHover(true)}
                    >
                        <div className="chatListNameAndMessage">
                            <div className="chatListName">{chatRoom.name}</div>
                            <div className="chatListRecentMessage">
                                {chatRoom.lastMessage
                                    ? `${chatRoom.lastMessage.author}: ${chatRoom.lastMessage.body}`
                                    : 'This room has no messages yet!'}
                            </div>
                        </div>

                        <div className="chatListRecentMessageTimeContainer">
                            {chatRoom.lastMessage && (
                                <div className="chatListRecentMessageTime">
                                    {dayjs().diff(
                                        dayjs(chatRoom.lastMessage.createdAt),
                                        'day'
                                    ) < 1
                                        ? `${dayjs(
                                              chatRoom.lastMessage.createdAt
                                          ).format('HH:mm')}`
                                        : dayjs().diff(
                                              dayjs(
                                                  chatRoom.lastMessage.createdAt
                                              ),
                                              'day'
                                          ) < 6
                                        ? `${dayjs(
                                              chatRoom.lastMessage.createdAt
                                          ).format('dddd')}`
                                        : `${dayjs(
                                              chatRoom.lastMessage.createdAt
                                          ).format('MM/DD')}`}
                                </div>
                            )}
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
        </>
    );
};

export default ChatListItem;
