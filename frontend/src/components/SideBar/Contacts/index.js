import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import { findContacts } from '../../../store/userContacts';

import './Contacts.css';
import ContactsItem from './ContactsItem';

const ContactsSearch = ({ selectedContacts, setSelectedContacts }) => {
    const dispatch = useDispatch();
    const [contactSearch, setContactSearch] = useState('');

    const userContacts = useSelector((state) => state.userContacts);
    const session = useSelector((state) => state.session);

    useEffect(() => {
        if (session.user && session.user.isLoaded)
            dispatch(findContacts(session.user.id));
    }, [session.user, dispatch]);

    const contactFilter = (contactsList) => {
        return contactsList.filter((contact) => {
            if (contactSearch) {
                return (
                    contact.name
                        .toLowerCase()
                        .includes(contactSearch.toLowerCase()) ||
                    contact.phoneNumber.includes(contactSearch)
                );
            } else return contact;
        });
    };

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
        document.querySelector('.searchInput').focus();
        document
            .querySelector('.addContactFormContainer')
            .classList.add('show');
        document
            .querySelector('.newRoomFormContainer')
            .classList.remove('show');
    };

    return (
        <>
            <div className="contactHeader">
                <h1 className="newRoomFormDescription">Add participants</h1>
                <div className="newRoomFormInputContainer">
                    <input
                        className="contactSearchInput"
                        value={contactSearch}
                        onChange={handleContactSearch}
                        placeholder="Search your contacts"
                    ></input>
                </div>
            </div>
            <div className="contactBody">
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
                <div className="userContacts">
                    {userContacts.isLoaded &&
                        contactFilter(userContacts.contacts).map(
                            (contact) =>
                                !selectedContacts
                                    .map(
                                        (selectedContact) => selectedContact.id
                                    )
                                    .includes(contact.id) && (
                                    <ContactsItem
                                        key={contact.id}
                                        contact={contact}
                                        setSelectedContacts={
                                            setSelectedContacts
                                        }
                                    />
                                )
                        )}
                </div>
            </div>
        </>
    );
};

export default ContactsSearch;
