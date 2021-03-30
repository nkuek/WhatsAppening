import { useState, useEffect, useRef } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {
    MenuList,
    MenuItem,
    Popper,
    Paper,
    IconButton,
    ClickAwayListener,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const CustomIconButton = withStyles({
    root: {
        margin: '0px 5px',
        height: 'fit-content',
        padding: '5px',
        color: '#B1B3B5',
    },
})(IconButton);

const DropdownMenu = ({ openNewRoomForm }) => {
    const dispatch = useDispatch();
    const anchorRef = useRef(null);
    const [showDropdownMenu, setShowDropdownMenu] = useState(false);

    const logout = (e) => {
        e.preventDefault();
        setShowDropdownMenu(false);
        dispatch(sessionActions.logout());
    };

    const toggleDropdownMenu = () => {
        setShowDropdownMenu((prev) => !prev);
    };

    return (
        <>
            <CustomIconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                ref={anchorRef}
                onClick={toggleDropdownMenu}
            >
                <MoreVertIcon />
            </CustomIconButton>
            <Popper
                open={showDropdownMenu}
                anchorEl={anchorRef.current}
                role={undefined}
                style={{
                    positon: 'relative',
                    zIndex: 2,
                    borderRadius: '5px',
                }}
            >
                <Paper
                    style={{
                        marginBottom: '3px',
                        position: 'relative',
                        zIndex: 1,
                        borderRadius: '5px',
                    }}
                >
                    <ClickAwayListener
                        onClickAway={() => setShowDropdownMenu(false)}
                    >
                        <div className="dropdownContainer">
                            <ul className="dropdownList">
                                <li
                                    onClick={openNewRoomForm}
                                    className="dropdownItem"
                                >
                                    <div>Create New Room</div>
                                </li>
                                <li onClick={logout} className="dropdownItem">
                                    <div>Logout</div>
                                </li>
                            </ul>
                        </div>
                    </ClickAwayListener>
                </Paper>
            </Popper>
        </>
    );
};

export default DropdownMenu;
