import { useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import GroupAddIcon from '@material-ui/icons/GroupAdd';

import './Contacts.css';

const ContactsSearch = () => {
    const [contactSearch, setContactSearch] = useState('');

    const handleContactSearch = (e) => {
        setContactSearch(e.target.value);
        if (e.target.value)
            document.querySelector('.contactBody').classList.add('searching');
        else
            document
                .querySelector('.contactBody')
                .classList.remove('searching');
    };
    const showUserSearch = () => {
        document
            .querySelector('.addContactFormContainer')
            .classList.add('show');
    };
    return (
        <>
            <div className="contactBody">
                <h1 className="newRoomFormDescription">Contacts</h1>
                <div className="newRoomFormInputContainer">
                    <input
                        value={contactSearch}
                        onChange={handleContactSearch}
                        placeholder="Search your contacts"
                    ></input>
                    <SearchIcon
                        style={{
                            color: 'white',
                            position: 'absolute',
                            left: '30px',
                            top: '50px',
                            cursor: 'pointer',
                        }}
                    />
                </div>
                <div
                    onClick={showUserSearch}
                    className="addContactButtonContainer"
                >
                    <div className="addContactButton">
                        <GroupAddIcon
                            style={{
                                color: 'white',
                                margin: '0px 10px',
                                backgroundColor: '#009688',
                                borderRadius: '100%',
                                padding: '10px',
                            }}
                        />
                        Add a contact
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactsSearch;
