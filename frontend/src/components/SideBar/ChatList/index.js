import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { findUserRoom, setRoomId } from '../../../store/chatroom';
import { getUserRooms } from '../../../store/chatlist';
import ChatListSearchContacts from './ChatListSearchContacts';
import ChatListSearchRooms from './ChatListSearchRooms';
import ChatListItem from './ChatListItem';
import { resetSearch, searchAll } from '../../../store/chatlistsearch';

import './ChatList.css';

const ChatList = () => {
    const isMobile = useMediaQuery({ query: '(max-width: 800px)' });
    const dispatch = useDispatch();
    const [selectedItem, setSelectedItem] = useState('');
    const [chatListSearchInput, setChatListSearchInput] = useState('');

    const chatList = useSelector((state) => state.chatList);
    const user = useSelector((state) => state.session.user);
    const chatRoom = useSelector((state) => state.chatRoom);
    const socket = useSelector((state) => state.chatRoom.socket);
    const searchResults = useSelector((state) => state.searchResults);

    useEffect(() => {
        if (chatRoom.room) setSelectedItem(chatRoom.room.id);
        const chatRoomMessageInput = document.querySelector(
            '.chatRoomMessageInput'
        );
        chatRoom.room && chatRoomMessageInput.focus();
    }, [chatRoom.room]);

    useEffect(() => {
        if (!chatListSearchInput) dispatch(resetSearch());
        else {
            const timer = setTimeout(() => {
                dispatch(searchAll(chatListSearchInput));
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [chatListSearchInput, dispatch]);

    const handleChatListClick = (chatId, chatRoom) => {
        if (isMobile) {
            document.querySelector('.sidebarContainer').classList.add('hide');
        }
        if (isMobile && document.querySelector('.chatRoomContainer')) {
            document
                .querySelector('.chatRoomContainer')
                .classList.remove('hide');
        }
        dispatch(setRoomId(chatId));

        const selectedElement = document.getElementById(selectedItem);
        const clickedChat = document.getElementById(chatId);

        dispatch(findUserRoom(chatId));

        selectedItem &&
            selectedElement &&
            selectedElement.classList.add('selected');
        if (!clickedChat.classList.contains('selected')) {
            clickedChat.classList.remove('selected');
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
            <div className="chatListSearchContainer">
                <div>
                    <input
                        placeholder="Search or start a new chat"
                        className="chatListSearch"
                        value={chatListSearchInput}
                        onChange={(e) => setChatListSearchInput(e.target.value)}
                    ></input>
                </div>
            </div>
            {!searchResults
                ? chatList.length > 0 &&
                  chatList.map((chatRoom) => (
                      <ChatListItem
                          key={chatRoom.id}
                          chatRoom={chatRoom}
                          handleChatListClick={handleChatListClick}
                          selectedItem={selectedItem}
                          setSelectedItem={setSelectedItem}
                          user={user}
                      />
                  ))
                : searchResults && (
                      <>
                          <ChatListSearchContacts
                              setChatListSearchInput={setChatListSearchInput}
                          />
                          <ChatListSearchRooms
                              setChatListSearchInput={setChatListSearchInput}
                          />
                      </>
                  )}
        </div>
    );
};

export default ChatList;
