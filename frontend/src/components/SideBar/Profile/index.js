import { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Avatar, IconButton } from '@material-ui/core';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import * as sessionActions from '../../../store/session';
import { removeUserRooms } from '../../../store/chatlist';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import { withStyles } from '@material-ui/styles';
import { resetUserRoomState } from '../../../store/chatroom';

import './Profile.css';

const CustomAvatar = withStyles({
    root: {
        width: '150px',
        height: '150px',
    },
})(Avatar);

const Profile = ({ user }) => {
    const editNameRef = useRef(null);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [name, setName] = useState('');
    const [showEditName, setShowEditName] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) setName(user.name);
        if (user && user.profileUrl) setPreview(user.profileUrl);
    }, [user]);

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
        openProfile();
        dispatch(removeUserRooms());
        dispatch(resetUserRoomState());
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
        dispatch(sessionActions.editUserProfile(name, image));
        setImage('');
        setShowEditName(false);
    };

    useEffect(() => {
        if (showEditName) {
            document.addEventListener('click', closeEditName);
            return () => document.removeEventListener('click', closeEditName);
        }
    }, [showEditName]);

    return (
        <>
            <div className="profileHeader">
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
                                    onClick={() => setShowEditName(true)}
                                />
                            </>
                        )}
                        {showEditName && (
                            <>
                                <input
                                    className="userNameEdit"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                ></input>
                                <ClearIcon
                                    style={{
                                        position: 'relative',
                                        left: '-30px',
                                        top: '2px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => setShowEditName(false)}
                                />
                            </>
                        )}
                    </div>
                </div>
                {(showEditName || image) && (
                    <button
                        onClick={handleEditProfile}
                        type="submit"
                        className="editProfileSubmit"
                    >
                        Edit
                    </button>
                )}
                <div className="profileLogoutButtonContainer">
                    <button onClick={logout} className="profileLogoutButton">
                        Logout
                    </button>
                </div>
            </form>
        </>
    );
};

export default Profile;
