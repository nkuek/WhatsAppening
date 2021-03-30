import { useState } from 'react';
import { useSelector } from 'react-redux';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { IconButton } from '@material-ui/core';
const NewRoomForm = ({ setShowNewRoomForm, socket }) => {
    const [roomName, setRoomName] = useState('');

    const user = useSelector((state) => state.session.user);

    const closeShowNewRoomForm = () => {
        setShowNewRoomForm(false);
    };

    const handleNewRoomSubmit = (e) => {
        e.preventDefault();
        socket.emit('new room', { name: roomName, adminId: user.id });
    };
    return (
        <div className="newRoomFormContainer">
            <div className="newRoomFormHeader">
                <IconButton
                    style={{ color: 'white' }}
                    onClick={closeShowNewRoomForm}
                >
                    <KeyboardBackspaceIcon />
                </IconButton>
                <div className="newRoomFormTitle">New Chat</div>
            </div>
            <form onSubmit={handleNewRoomSubmit} className="newRoomForm">
                <div className="newRoomFormInputContainer">
                    <input
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        type="text"
                        placeholder="Room Name"
                    ></input>
                </div>
            </form>
        </div>
    );
};

export default NewRoomForm;
