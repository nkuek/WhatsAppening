import { useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { IconButton } from '@material-ui/core';

const UserSearch = () => {
    const [userSearch, setUserSearch] = useState('');

    const resetForm = () => {
        document
            .querySelector('.addContactFormContainer')
            .classList.toggle('show');
        setTimeout(() => {
            setUserSearch('');
        }, 500);
    };

    const handleUserSearch = (e) => {
        setUserSearch(e.target.value);
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
                        value={userSearch}
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
            </div>
        </>
    );
};

export default UserSearch;
