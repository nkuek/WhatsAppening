import { useState } from 'react';
import { useSelector } from 'react-redux';
import ChatIcon from '@material-ui/icons/Chat';
import { IconButton } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/styles';
import { useMediaQuery } from 'react-responsive';

import ProfileButton from './Profile/ProfileButton';
import NewRoomForm from './NewRoomForm';
import DropdownMenu from './DropdownMenu';
import AddContact from './AddContact';

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
    const isMobile = useMediaQuery({ query: '(max-width: 800px)' });

    const session = useSelector((state) => state.session);

    const [showProfile, setShowProfile] = useState(false);

    const openNewRoomForm = () => {
        document
            .querySelector('.newRoomFormContainer')
            .classList.toggle('show');
        document.querySelector('.newRoomFormInput').focus();
    };

    const openProfile = () => {
        document.querySelector('.profileContainer').classList.toggle('show');
    };

    return (
        <>
            <div className={`sidebarContainer ${isMobile ? 'mobile' : ''}`}>
                <div
                    style={{
                        justifyContent: !session.user && 'center',
                    }}
                    className="sidebarContentHeader"
                >
                    {session.user && session.isLoaded && (
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
                    )}
                </div>
                <div className="sidebarContentBody">
                    <ChatList />
                </div>
            </div>

            <div className={`newRoomFormContainer ${isMobile ? 'mobile' : ''}`}>
                <NewRoomForm socket={socket} />
            </div>

            <div className={`profileContainer ${isMobile ? 'mobile' : ''}`}>
                <Profile openProfile={openProfile} user={session.user} />
            </div>

            <div
                className={`addContactFormContainer ${
                    isMobile ? 'mobile' : ''
                }`}
            >
                <AddContact />
            </div>
        </>
    );
};

export default SideBar;
