import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import { findContacts } from '../../../store/userContacts';

import './Contacts.css';
import CloseIcon from '@material-ui/icons/Close';
import ContactsItem from './ContactsItem';
import { Avatar } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const CustomCloseIcon = withStyles({
    root: {
        '&:hover': {
            backgroundColor: 'gray',
        },
        borderRadius: '100%',
        marginLeft: '10px',
        cursor: 'pointer',
        height: '12px',
        width: '12px',
        padding: '2px',
    },
})(CloseIcon);

const ContactsSearch = ({
    roomName,
    handleNewRoomSubmit,
    selectedContacts,
    setSelectedContacts,
    contactSearch,
    setContactSearch,
}) => {
    const dispatch = useDispatch();

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

    const handleRemoveContactFromState = (contactId) => {
        const newSelectedContacts = selectedContacts.filter(
            (contact) => contact.id !== contactId
        );
        setSelectedContacts(newSelectedContacts);
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
            <div className="contactBody">
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
                <div className="contactListBody">
                    <div className="selectedContactsContainer">
                        {selectedContacts &&
                            selectedContacts.map((contact) => (
                                <div
                                    key={contact.id}
                                    className="selectedContactsItem"
                                >
                                    <div className="selectedContactInfo">
                                        <div className="selectedContactProfileImage">
                                            <Avatar src={contact.profileUrl} />
                                        </div>
                                        <div className="selectedContactName">
                                            {contact.name}
                                        </div>
                                        <CustomCloseIcon
                                            onClick={() =>
                                                handleRemoveContactFromState(
                                                    contact.id
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            ))}
                    </div>
                    {(roomName || selectedContacts.length > 0) && (
                        <div className="newRoomFormSubmitContainer">
                            <button
                                onClick={handleNewRoomSubmit}
                                className="newRoomFormSubmit"
                            >
                                Create
                            </button>
                        </div>
                    )}
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
                                            (selectedContact) =>
                                                selectedContact.id
                                        )
                                        .includes(contact.id) && (
                                        <ContactsItem
                                            key={contact.id}
                                            contact={contact}
                                            setSelectedContacts={
                                                setSelectedContacts
                                            }
                                            contactSearch={contactSearch}
                                            setContactSearch={setContactSearch}
                                        />
                                    )
                            )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactsSearch;
