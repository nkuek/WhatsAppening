import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { IconButton } from '@material-ui/core';
const NewRoomForm = ({ setShowNewRoomForm, socket }) => {
    const closeShowNewRoomForm = () => {
        setShowNewRoomForm(false);
    };

    const handleNewRoomSubmit = (e) => {
        e.preventDefault();
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
            <form className="newRoomForm">
                <div className="newRoomFormInputContainer">
                    <input type="text" placeholder="Room Name"></input>
                </div>
            </form>
        </div>
    );
};

export default NewRoomForm;
