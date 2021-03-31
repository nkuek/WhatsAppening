import { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import * as sessionActions from '../../store/session';
import { removeUserRooms } from '../../store/chatlist';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';

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
        setTimeout(() => {
            setImage(null);
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
        console.log(file);
    };

    const logout = (e) => {
        e.preventDefault();
        openProfile();
        dispatch(removeUserRooms());
        dispatch(sessionActions.logout());
    };

    const openProfile = () => {
        document.querySelector('.profileContainer').classList.toggle('show');
    };

    // const closeEditName = (e) => {

    //     if (editNameRef.current === e.target) {
    //         setShowEditName(false);
    //     }
    // };

    const closeEditName = (e) => {
        if (e.target !== editNameRef.current && showEditName)
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
                // ref={editNameRef}
                // onClick={closeEditName}
                className="profileBody"
            >
                <div className="fileWrapper">
                    <img
                        className="imgPreview"
                        src={
                            !preview
                                ? 'https://i.stack.imgur.com/l60Hf.png'
                                : preview
                        }
                    ></img>
                    <input
                        onChange={updateFile}
                        className="fileInput"
                        type="file"
                        accept="image/gif,image/jpeg,image/jpg,image/png"
                    ></input>
                </div>
                <div onClick={closeEditName} className="profileInformation">
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
                                    ref={editNameRef}
                                    className="userNameEdit"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                ></input>
                                <ClearIcon
                                    style={{
                                        position: 'relative',
                                        left: '-60px',
                                        top: '2px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => setShowEditName(false)}
                                />
                            </>
                        )}
                    </div>
                </div>
                <button className="editProfileSubmit">Edit</button>
            </form>
            <button onClick={logout} className="profileLogoutButton">
                Logout
            </button>
        </>
    );
};

export default Profile;
