import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchIcon from '@material-ui/icons/Search';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { Avatar, IconButton } from '@material-ui/core';
import { searchUsers, clearSearchUsers } from '../../../store/usersearch';
import ConfirmContactModal from '../../ConfirmContactModal';

import './AddContact.css';

const UserSearch = () => {
    const dispatch = useDispatch();

    const [userSearchInput, setUserSearchInput] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');

    const userSearch = useSelector((state) => state.userSearch);
    const userContacts = useSelector((state) => state.userContacts);

    useEffect(() => {
        if (!userSearchInput) dispatch(clearSearchUsers());
        else {
            const timer = setTimeout(() => {
                dispatch(searchUsers(userSearchInput));
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [userSearchInput]);

    const resetForm = () => {
        document
            .querySelector('.addContactFormContainer')
            .classList.toggle('show');

        document.querySelector('.newRoomFormContainer').classList.add('show');
        setTimeout(() => {
            setUserSearchInput('');
            dispatch(clearSearchUsers());
        }, 500);
    };

    const handleUserSearch = (e) => {
        setUserSearchInput(e.target.value);
    };

    const handleContactClick = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    return (
        <>
            <div className="addContactHeader">
                <IconButton style={{ color: 'white' }} onClick={resetForm}>
                    <KeyboardBackspaceIcon />
                </IconButton>
                <div className="addContactTitle">User Search</div>
            </div>
            <div className="addContactBody">
                <div className="newRoomFormInputContainer">
                    <input
                        value={userSearchInput}
                        onChange={handleUserSearch}
                        placeholder="Search for a user"
                    ></input>
                    <SearchIcon
                        style={{
                            color: 'white',
                            position: 'relative',
                            top: '-30px',
                            left: '30px',
                            cursor: 'pointer',
                        }}
                    />
                </div>
                <div className="searchResults">
                    {userSearch.isLoaded &&
                        userSearch.users.map((user) => (
                            <div
                                key={user.id}
                                onClick={() => handleContactClick(user)}
                                className="userResult"
                            >
                                <div className="userResultProfileImage">
                                    <Avatar src={user.profileUrl} />
                                </div>
                                <div className="userResultInfoContainer">
                                    <div className="userResultInfo">
                                        {user.name}
                                    </div>
                                    <div className="userResultInfo">
                                        {user.phoneNumber}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            {showModal && (
                <ConfirmContactModal
                    user={selectedUser}
                    setShowModal={setShowModal}
                />
            )}
        </>
    );
};

export default UserSearch;
