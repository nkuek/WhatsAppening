import { useState } from 'react';
import { useSelector } from 'react-redux';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { IconButton } from '@material-ui/core';
const NewRoomForm = ({ socket }) => {
    const user = useSelector((state) => state.session.user);

    const [roomName, setRoomName] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(user && user.profileUrl);

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

    const openNewRoomForm = () => {
        document
            .querySelector('.newRoomFormContainer')
            .classList.toggle('show');
        document.querySelector('.sidebarContainer').classList.toggle('hidden');
        setTimeout(() => {
            setRoomName('');
            setImage(null);
            setPreview(null);
        }, 500);
    };

    const handleNewRoomSubmit = (e) => {
        e.preventDefault();
        console.log(image);
        socket.emit('new room', { name: roomName, adminId: user.id, image });
        setRoomName('');
        setImage(null);
        setPreview(null);
        openNewRoomForm();
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
                <div className="fileWrapper">
                    <img
                        className="imgPreview"
                        src={
                            !preview
                                ? 'https://i.stack.imgur.com/l60Hf.png'
                                : preview
                        }
                    ></img>
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
                </div>
            </form>
        </>
    );
};

export default NewRoomForm;
