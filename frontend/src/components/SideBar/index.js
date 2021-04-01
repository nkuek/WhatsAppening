import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ChatIcon from '@material-ui/icons/Chat';
import { IconButton } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/styles';

import ProfileButton from './ProfileButton';
import SignupFormModal from '../SignupFormModal';
import LoginFormModal from '../LoginFormModal';
import NewRoomForm from './NewRoomForm';
import DropdownMenu from './DropdownMenu';
import getUserRooms from '../../store/chatlist';

import './SideBar.css';
import Profile from './Profile';
import ChatList from './ChatList';

const CustomIconButton = withStyles({
    root: {
        margin: '0px 5px',
        height: 'fit-content',
        padding: '5px',
        color: '#B1B3B5',
    },
})(IconButton);

const SideBar = ({ socket }) => {
    const session = useSelector((state) => state.session);

    const [showProfile, setShowProfile] = useState(false);

    const openNewRoomForm = () => {
        document
            .querySelector('.newRoomFormContainer')
            .classList.toggle('show');
    };

    const openProfile = () => {
        document.querySelector('.profileContainer').classList.toggle('show');
    };

    return (
        <>
            <div className="sidebarContainer">
                <div className="sidebarContent">
                    <div className="sidebarContentHeader">
                        {session.user && session.isLoaded ? (
                            <>
                                <ProfileButton
                                    setShowProfile={setShowProfile}
                                    showProfile={showProfile}
                                    user={session.user}
                                />
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
                                    <DropdownMenu />
                                </div>
                            </>
                        ) : (
                            <div className="loginSignup">
                                <LoginFormModal /> <SignupFormModal />
                            </div>
                        )}
                    </div>
                </div>
                <div className="sidebarContentBody">
                    <ChatList />
                </div>
            </div>

            <div className="newRoomFormContainer">
                <NewRoomForm socket={socket} />
            </div>

            <div className="profileContainer">
                <Profile openProfile={openProfile} user={session.user} />
            </div>
        </>
    );
};

export default SideBar;
