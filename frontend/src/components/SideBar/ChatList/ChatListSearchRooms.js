import { Avatar } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { findUserRoom, setRoomId } from '../../../store/chatroom';
import dayjs from 'dayjs';

const ChatListSearchRooms = ({ setChatListSearchInput }) => {
    const dispatch = useDispatch();
    const searchResults = useSelector((state) => state.searchResults);

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (searchResults) setIsLoaded(true);
    }, [searchResults, isLoaded]);

    const handleClick = (chatId) => {
        dispatch(setRoomId(chatId));
        dispatch(findUserRoom(chatId));
        setChatListSearchInput('');
    };
    return (
        <>
            <div className="chatListSearchHeader">Chat</div>
            {isLoaded && searchResults.chatRooms.length === 0 ? (
                <div className="chatListSearchNoResults">No results</div>
            ) : (
                searchResults.chatRooms.map((chatRoom) => (
                    <div
                        key={chatRoom.id}
                        onClick={() => handleClick(chatRoom.id)}
                        className="chatListItem searchResult"
                    >
                        <div className="chatListItemContainer">
                            <div className="readStatus"></div>
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
                                    {chatRoom.lastMessage && (
                                        <div className="chatListRecentMessageTime">
                                            {dayjs().diff(
                                                dayjs(
                                                    chatRoom.lastMessage
                                                        .createdAt
                                                ),
                                                'day'
                                            ) < 1
                                                ? `${dayjs(
                                                      chatRoom.lastMessage
                                                          .createdAt
                                                  ).format('HH:mm')}`
                                                : dayjs().diff(
                                                      dayjs(
                                                          chatRoom.lastMessage
                                                              .createdAt
                                                      ),
                                                      'day'
                                                  ) < 6
                                                ? `${dayjs(
                                                      chatRoom.lastMessage
                                                          .createdAt
                                                  ).format('dddd')}`
                                                : `${dayjs(
                                                      chatRoom.lastMessage
                                                          .createdAt
                                                  ).format('MM/DD')}`}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </>
    );
};

export default ChatListSearchRooms;
