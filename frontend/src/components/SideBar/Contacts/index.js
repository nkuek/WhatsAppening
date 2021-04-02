import { useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';

const ContactsSearch = () => {
    const [contactSearch, setContactSearch] = useState('');
    const [userSearch, setUserSearch] = useState('');

    const handleUserSearch = (e) => {
        setUserSearch(e.target.value);
    };
    const handleContactSearch = (e) => {
        setContactSearch(e.target.value);
        if (e.target.value)
            document
                .querySelector('.contactsContainer')
                .classList.add('searching');
        else
            document
                .querySelector('.contactsContainer')
                .classList.remove('searching');
    };
    return (
        <div className="contactsContainer">
            <h1 className="newRoomFormDescription">Contacts</h1>
            <div className="newRoomFormInputContainer">
                <input
                    value={contactSearch}
                    onChange={handleContactSearch}
                    placeholder="Search or start a new chat"
                ></input>
                <SearchIcon
                    style={{
                        color: 'white',
                        position: 'relative',
                        left: '-365px',
                        top: '8px',
                        cursor: 'pointer',
                    }}
                />
            </div>
            <div className="contactsBody">
                <div className="addContactForm">
                    <div className="newRoomFormInputContainer">
                        <input
                            value={userSearch}
                            onChange={handleUserSearch}
                            placeholder="Search or start a new chat"
                        ></input>
                        <SearchIcon
                            style={{
                                color: 'white',
                                position: 'relative',
                                left: '-365px',
                                top: '8px',
                                cursor: 'pointer',
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactsSearch;
