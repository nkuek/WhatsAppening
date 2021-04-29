import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, IconButton } from '@material-ui/core';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import * as sessionActions from '../../../store/session';
import { removeUserRooms } from '../../../store/chatlist';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import { withStyles } from '@material-ui/styles';
import { closeSocket, resetUserRoomState } from '../../../store/chatroom';
import { removeUserContactsState } from '../../../store/userContacts';

import './Profile.css';
import { clearSearchUsers } from '../../../store/usersearch';

const CustomAvatar = withStyles({
    root: {
        width: '10rem',
        height: '10rem',
    },
})(Avatar);

const Profile = ({ user }) => {
    const editNameRef = useRef(null);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [name, setName] = useState('');
    const [showEditName, setShowEditName] = useState(false);
    const [isPublic, setIsPublic] = useState('');
    const dispatch = useDispatch();

    const socket = useSelector((state) => state.chatRoom.socket);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setIsPublic(user.isPublic);
            setPreview(user.profileUrl);
        }
    }, [user]);

    useEffect(() => {
        const editInput = document.querySelector('.userNameEdit');
        if (showEditName) editInput.focus();
    }, [showEditName]);

    const resetForm = () => {
        openProfile();
        document.getElementById('profilePictureInput').value = '';
        setTimeout(() => {
            setImage('');
            if (user && user.profileUrl) setPreview(user.profileUrl);
            setName(user.name);
            setShowEditName(false);
        }, 500);
    };

    const updateFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            let reader = new FileReader();

            reader.onload = function (e) {
                setPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const logout = (e) => {
        e.preventDefault();
        e.stopPropagation();
        openProfile();
        dispatch(removeUserRooms());
        dispatch(resetUserRoomState());
        dispatch(removeUserContactsState());
        dispatch(clearSearchUsers());
        socket.emit('disconnect user');
        dispatch(closeSocket());
        dispatch(sessionActions.logout());
    };

    const openProfile = () => {
        document.querySelector('.profileContainer').classList.toggle('show');
    };

    const closeEditName = (e) => {
        if (showEditName) {
            if (e.target === editNameRef.current) setShowEditName(false);
        }
        return;
    };

    const handleEditProfile = (e) => {
        e.preventDefault();
        if (name === user.name) {
            setShowEditName(false);
            return;
        }
        dispatch(sessionActions.editUserProfile(name, image));
        setImage('');
        setShowEditName(false);
    };

    const handlePrivacyEdit = (e) => {
        setIsPublic(e.target.value);
        dispatch(sessionActions.editUserPrivacy(e.target.value));
    };

    const handleShowEditName = () => {
        setShowEditName(true);
    };

    useEffect(() => {
        if (showEditName) {
            document.addEventListener('click', closeEditName);
            return () => document.removeEventListener('click', closeEditName);
        }
    });

    return (
        <>
            <div className={`profileHeader `}>
                <IconButton style={{ color: 'white' }} onClick={resetForm}>
                    <KeyboardBackspaceIcon />
                </IconButton>
                <div className="profileTitle">Profile</div>
            </div>
            <form
                onClick={closeEditName}
                onSubmit={handleEditProfile}
                className="profileBody"
                ref={editNameRef}
            >
                <h1 className="profileDescription">Your Profile</h1>
                <div className="fileWrapper">
                    <CustomAvatar
                        className="imgPreview"
                        src={preview && preview}
                    ></CustomAvatar>
                    <input
                        onChange={updateFile}
                        className="fileInput"
                        id="profilePictureInput"
                        type="file"
                        accept="image/gif,image/jpeg,image/jpg,image/png"
                    ></input>
                </div>
                <div className="profileInformation">
                    <div className="profileName">Your Name</div>
                    <div className="userNameAndEdit">
                        {!showEditName && (
                            <>
                                <div className="userName">
                                    {user && user.name}
                                </div>
                                <EditIcon
                                    style={{
                                        color: 'white',
                                        cursor: 'pointer',
                                    }}
                                    onClick={handleShowEditName}
                                />
                            </>
                        )}
                        {showEditName && (
                            <>
                                <CheckIcon
                                    style={{
                                        color: 'white',
                                        position: 'absolute',
                                        right: '0px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={handleEditProfile}
                                />
                                <input
                                    className="userNameEdit"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                ></input>
                            </>
                        )}
                    </div>

                    <div className="editPrivacyContainer">
                        <div className="userPrivacy">Privacy Setting</div>
                        <select value={isPublic} onChange={handlePrivacyEdit}>
                            <option value={true}>Public</option>
                            <option value={false}>Private</option>
                        </select>
                    </div>
                </div>
            </form>
            <div className="profileLogoutButtonContainer">
                <button onClick={logout} className="profileLogoutButton">
                    Logout
                </button>
            </div>
        </>
    );
};

export default Profile;
