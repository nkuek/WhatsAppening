import { useMediaQuery } from 'react-responsive';
import { Avatar } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createNewRoom } from '../../../store/chatroom';

const ChatListSearchContacts = ({ setChatListSearchInput }) => {
    const isMobile = useMediaQuery({ query: '(max-width: 800px' });
    const dispatch = useDispatch();
    const searchResults = useSelector((state) => state.searchResults);
    const socket = useSelector((state) => state.chatRoom.socket);

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (searchResults) setIsLoaded(true);
    }, [searchResults, isLoaded]);

    const handleClick = (contactName, contactImage, contact) => {
        if (isMobile)
            document.querySelector('.sidebarContainer').classList.add('hide');
        const firstName = contactName
            .split(' ')
            .filter((name) => !name.includes('.'))[0];
        dispatch(createNewRoom(firstName, contactImage, contact));
        socket && socket.emit('new room');
        setChatListSearchInput('');
    };

    return (
        <>
            <div className="chatListSearchHeader">Contacts</div>
            {isLoaded && searchResults.contacts.length === 0 ? (
                <div className="chatListSearchNoResults">No results</div>
            ) : (
                searchResults.contacts.map((contact) => (
                    <div
                        key={contact.id}
                        onClick={() =>
                            handleClick(contact.name, contact.profileUrl, [
                                contact,
                            ])
                        }
                        className="userResult"
                    >
                        <div className="userResultProfileImage">
                            <Avatar src={contact.profileUrl} />
                        </div>
                        <div className="userResultInfoContainer">
                            <div className="userResultInfo">{contact.name}</div>
                            <div className="userResultInfo">
                                {contact.phoneNumber}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </>
    );
};

export default ChatListSearchContacts;
