import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

    useEffect(() => {
        if (!userSearchInput) dispatch(clearSearchUsers());
        else {
            const timer = setTimeout(() => {
                dispatch(searchUsers(userSearchInput));
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [userSearchInput, dispatch]);

    const resetForm = () => {
        document
            .querySelector('.addContactFormContainer')
            .classList.toggle('show');

        document.querySelector('.newRoomFormContainer').classList.add('show');
        document.querySelector('.newRoomFormInput').focus();
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
                        className="searchInput"
                        value={userSearchInput}
                        onChange={handleUserSearch}
                        placeholder="Search users by name or phone number"
                    ></input>
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
                    setUserSearchInput={setUserSearchInput}
                />
            )}
        </>
    );
};

export default UserSearch;
