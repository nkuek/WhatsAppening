import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Avatar, ClickAwayListener, IconButton } from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/Remove';
import { deleteContact } from '../../../store/userContacts';
const ContactsItem = ({ contact, setSelectedContacts }) => {
    const dispatch = useDispatch();
    const [contactHover, setContactHover] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);

    const handleShowDelete = (e) => {
        e.stopPropagation();
        document
            .getElementById(`contactContainer${contact.id}`)
            .classList.add('showContainer');
        document
            .getElementById(`contact${contact.id}`)
            .classList.add('showButton');
        setContactHover(false);
    };

    const handleContactClick = (contact) => {
        setSelectedContacts((prev) => [...prev, contact]);
    };

    const handleDeleteContact = (e) => {
        e.stopPropagation();
        dispatch(deleteContact(contact.id));
    };

    const handleHideDeleteButton = () => {
        document
            .getElementById(`contactContainer${contact.id}`)
            .classList.remove('showContainer');
        document
            .getElementById(`contact${contact.id}`)
            .classList.remove('showButton');
    };

    return (
        <div
            onMouseEnter={() => setContactHover(true)}
            onMouseLeave={() => {
                setContactHover(false);
                showDeleteButton && setShowDeleteButton(false);
            }}
            onClick={() => handleContactClick(contact)}
            className="userResult contact"
        >
            <div className="userProfileAndName">
                <div className="userResultProfileImage">
                    <Avatar src={contact.profileUrl} />
                </div>
                <div className="userResultInfoContainer">
                    <div className="userResultInfo">{contact.name}</div>
                    <div className="userResultInfo">{contact.phoneNumber}</div>
                </div>
            </div>
            {contactHover && (
                <IconButton
                    style={{
                        padding: '8px',
                        position: 'relative',
                        zIndex: 1,
                        // margin: '0 -50px 0 0',
                    }}
                    onClick={handleShowDelete}
                >
                    <RemoveIcon style={{ color: 'red' }} />
                </IconButton>
            )}
            <ClickAwayListener onClickAway={handleHideDeleteButton}>
                <div
                    id={`contactContainer${contact.id}`}
                    className={`contactDeleteButtonContainer`}
                >
                    <div
                        id={`contact${contact.id}`}
                        className="contactDeleteButton"
                        onClick={handleDeleteContact}
                    >
                        Delete
                    </div>
                </div>
            </ClickAwayListener>
        </div>
    );
};

export default ContactsItem;
