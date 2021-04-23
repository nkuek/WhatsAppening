import { useState, useRef } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
    Popper,
    Paper,
    IconButton,
    ClickAwayListener,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import ConfirmDeleteChatRoom from './ConfirmDeleteChatRoom';

const CustomIconButton = withStyles({
    root: {
        margin: '0px 5px',
        height: 'fit-content',
        padding: '5px',
        color: '#B1B3B5',
    },
})(IconButton);

const ChatListDropdown = ({
    messageId,
    chatRoomId,
    showDropdownMenu,
    setShowDropdownMenu,
    setChatListHover,
    setSelectedItem,
}) => {
    const [showModal, setShowModal] = useState(false);
    const anchorRef = useRef(null);

    const toggleDropdownMenu = (e) => {
        e.stopPropagation();
        setShowDropdownMenu((prev) => !prev);
    };

    const handleDeleteChatRoom = (e) => {
        e.stopPropagation();
        setShowModal(true);
    };

    const handleClickAway = () => {
        setShowDropdownMenu(false);
        setChatListHover(false);
    };

    return (
        <>
            <CustomIconButton
                className="chatListDropdownMenu"
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                ref={anchorRef}
                onClick={toggleDropdownMenu}
            >
                <ExpandMoreIcon />
            </CustomIconButton>
            <Popper
                open={showDropdownMenu}
                anchorEl={anchorRef.current}
                role={undefined}
                style={{
                    positon: 'relative',
                    zIndex: 10,
                }}
            >
                <Paper
                    style={{
                        position: 'relative',
                        zIndex: 1,
                        display: 'flex',
                    }}
                >
                    <ClickAwayListener onClickAway={handleClickAway}>
                        <div className="dropdownContainer message">
                            <ul className="dropdownList message">
                                <li
                                    onClick={handleDeleteChatRoom}
                                    className="dropdownItem message"
                                >
                                    <div className="dropdownItemLabel">
                                        Delete
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </ClickAwayListener>
                </Paper>
            </Popper>
            {showModal && (
                <ConfirmDeleteChatRoom
                    chatRoomId={chatRoomId}
                    messageId={messageId}
                    setShowModal={setShowModal}
                    setSelectedItem={setSelectedItem}
                />
            )}
        </>
    );
};

export default ChatListDropdown;
