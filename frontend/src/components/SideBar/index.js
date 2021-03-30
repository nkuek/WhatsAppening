import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ChatIcon from '@material-ui/icons/Chat';
import { IconButton } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/styles';

import ProfileButton from './ProfileButton';
import SignupFormModal from '../SignupFormModal';
import LoginFormModal from '../LoginFormModal';
import NewRoomForm from './NewRoomForm';
import DropdownMenu from './DropdownMenu';

import './SideBar.css';
import Profile from './Profile';

const CustomIconButton = withStyles({
    root: {
        margin: '0px 5px',
        height: 'fit-content',
        padding: '5px',
        color: '#B1B3B5',
    },
})(IconButton);

const SideBar = ({ isLoaded, socket }) => {
    const sessionUser = useSelector((state) => state.session.user);

    const [showNewRoomForm, setShowNewRoomForm] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const openNewRoomForm = () => {
        setShowNewRoomForm((prev) => !prev);
    };

    console.log(showProfile);

    return (
        <div className="sidebarContainer">
            <div className="sidebarContent">
                {!showNewRoomForm && !showProfile ? (
                    <div className="sidebarContentHeader">
                        {isLoaded && (
                            <ProfileButton
                                setShowProfile={setShowProfile}
                                showProfile={showProfile}
                                user={sessionUser}
                            />
                        )}
                        {sessionUser ? (
                            <div className="sidebarButtonsContainer">
                                <CustomIconButton onClick={openNewRoomForm}>
                                    <Tooltip
                                        title="New Chat"
                                        key="newChat"
                                        placement="bottom"
                                        className="tooltip"
                                        arrow={true}
                                    >
                                        <ChatIcon />
                                    </Tooltip>
                                </CustomIconButton>
                                <DropdownMenu
                                    openNewRoomForm={openNewRoomForm}
                                />
                            </div>
                        ) : (
                            <div className="loginSignup">
                                <LoginFormModal /> <SignupFormModal />
                            </div>
                        )}
                    </div>
                ) : showNewRoomForm ? (
                    <NewRoomForm
                        setShowNewRoomForm={setShowNewRoomForm}
                        socket={socket}
                    />
                ) : (
                    <Profile
                        setShowProfile={setShowProfile}
                        user={sessionUser}
                    />
                )}
            </div>
            <div className="sidebarContentBody"></div>
        </div>
    );
};

export default SideBar;
