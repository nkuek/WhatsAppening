import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { Avatar, IconButton } from '@material-ui/core';
import { createNewRoom } from '../../store/chatroom';
import { withStyles } from '@material-ui/styles';
import CheckIcon from '@material-ui/icons/Check';
import SearchIcon from '@material-ui/icons/Search';

const CustomAvatar = withStyles({
    root: {
        width: '150px',
        height: '150px',
    },
})(Avatar);

const NewRoomForm = ({ socket }) => {
    const user = useSelector((state) => state.session.user);
    const dispatch = useDispatch();

    const [roomName, setRoomName] = useState('');
    const [image, setImage] = useState('');
    const [preview, setPreview] = useState(user && user.profileUrl);
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
            document.querySelector('.fileInput').value = '';
        }, 500);
    };
    const openNewRoomForm = () => {
        document
            .querySelector('.newRoomFormContainer')
            .classList.toggle('show');
        document.querySelector('.sidebarContainer').classList.toggle('hidden');
        resetForm();
    };

    const handleNewRoomSubmit = (e) => {
        e.preventDefault();
        dispatch(createNewRoom(roomName, user.id, image)).then(() =>
            socket.emit('new room', { adminId: user.id })
        );
        resetForm();
        openNewRoomForm();
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
                <div className="fileWrapper">
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
                <div className="newRoomFormInputContainer">
                    <input
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        type="text"
                        placeholder="Room Name"
                    ></input>
                    <CheckIcon
                        style={{
                            color: 'white',
                            position: 'relative',
                            left: '-365px',
                            top: '5px',
                            cursor: 'pointer',
                        }}
                        onClick={handleNewRoomSubmit}
                    />
                </div>
            </form>
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
            </div>
        </>
    );
};

export default NewRoomForm;
