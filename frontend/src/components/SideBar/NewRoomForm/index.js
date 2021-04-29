import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { Avatar, IconButton } from '@material-ui/core';
import { createNewRoom } from '../../../store/chatroom';
import { withStyles } from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';

import ContactsSearch from '../Contacts';

import './NewRoomForm.css';

const CustomAvatar = withStyles({
    root: {
        width: '10rem',
        height: '10rem',
    },
})(Avatar);

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

const NewRoomForm = () => {
    const dispatch = useDispatch();

    const socket = useSelector((state) => state.chatRoom.socket);

    const [roomName, setRoomName] = useState('');
    const [image, setImage] = useState('');
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [contactSearch, setContactSearch] = useState('');

    const updateFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            let reader = new FileReader();

            reader.onload = function (e) {
                setPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setTimeout(() => {
            setRoomName('');
            setImage(null);
            setPreview(null);
            setSelectedContacts([]);
            setErrors([]);
            setContactSearch('');
            document
                .querySelector('.contactBody')
                .classList.remove('searching');
            document.querySelector('.fileInput').value = '';
        }, 500);
    };
    const openNewRoomForm = () => {
        document
            .querySelector('.newRoomFormContainer')
            .classList.toggle('show');
        resetForm();
    };

    const handleNewRoomSubmit = (e) => {
        e.preventDefault();
        return dispatch(createNewRoom(roomName, image, selectedContacts))
            .then(() => {
                socket && socket.emit('new room');
                resetForm();
                openNewRoomForm();
            })
            .catch((res) => {
                if (res.data && res.data.errors) setErrors(res.data.errors);
            });
    };

    const handleRemoveContactFromState = (contactId) => {
        const newSelectedContacts = selectedContacts.filter(
            (contact) => contact.id !== contactId
        );
        setSelectedContacts(newSelectedContacts);
    };

    return (
        <>
            <div className="newRoomFormHeader">
                <IconButton
                    style={{ color: 'white' }}
                    onClick={openNewRoomForm}
                >
                    <KeyboardBackspaceIcon />
                </IconButton>
                <div className="newRoomFormTitle">New Chat</div>
            </div>
            <form onSubmit={handleNewRoomSubmit} className="newRoomForm">
                <h1 className="newRoomFormDescription">Create a new group</h1>
                <div className="fileWrapper newForm">
                    <CustomAvatar
                        className="imgPreview"
                        src={preview && preview}
                    ></CustomAvatar>
                    <input
                        onChange={updateFile}
                        className="fileInput"
                        type="file"
                        accept="image/gif,image/jpeg,image/jpg,image/png"
                    ></input>
                </div>
                {errors.length > 0 && (
                    <ul className="errors newRoom">
                        {errors.map((error, idx) => (
                            <li key={idx}>{error}</li>
                        ))}
                    </ul>
                )}
                <div className="newRoomFormInputContainer">
                    <input
                        className="newRoomFormInput"
                        required
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        type="text"
                        placeholder="Room Name"
                    ></input>
                </div>
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
                        <button className="newRoomFormSubmit">Create</button>
                    </div>
                )}
            </form>
            <ContactsSearch
                contactSearch={contactSearch}
                setContactSearch={setContactSearch}
                selectedContacts={selectedContacts}
                setSelectedContacts={setSelectedContacts}
            />
        </>
    );
};

export default NewRoomForm;
