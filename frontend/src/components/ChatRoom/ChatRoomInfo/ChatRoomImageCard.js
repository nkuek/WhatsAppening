import { useDispatch, useSelector } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import { Avatar } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import { editUserRoom } from '../../../store/chatroom';

const CustomAvatar = withStyles({
    root: {
        width: '150px',
        height: '150px',
    },
})(Avatar);

const ChatRoomImageCard = ({
    roomName,
    setRoomName,
    preview,
    setPreview,
    image,
    setImage,
    showEditName,
    setShowEditName,
}) => {
    const dispatch = useDispatch();

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

    const chatRoom = useSelector((state) => state.chatRoom);

    const handleEditChatRoomInfo = (e) => {
        e.preventDefault();
        dispatch(
            editUserRoom(
                chatRoom.room.id,
                roomName,
                chatRoom.room.description,
                image
            )
        );
        setShowEditName(false);
        setImage('');
    };

    return (
        chatRoom.isLoaded && (
            <form onSubmit={handleEditChatRoomInfo}>
                <div className="chatRoomImageCard">
                    <div className="fileWrapper chatRoom">
                        <CustomAvatar
                            className="imgPreview"
                            src={preview && preview}
                        ></CustomAvatar>
                        <input
                            onChange={updateFile}
                            className="fileInput chatRoomImage"
                            id="chatRoomImageInput"
                            type="file"
                            accept="image/gif,image/jpeg,image/jpg,image/png"
                        ></input>
                    </div>
                </div>
                <div className="chatRoomNameCardContainer">
                    <div className="chatRoomNameAndEdit">
                        {!showEditName ? (
                            <>
                                <div className="chatRoomCardName">
                                    {chatRoom.room.name}
                                </div>
                                <EditIcon
                                    style={{
                                        color: 'rgb(163, 163, 163)',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => setShowEditName(true)}
                                />
                            </>
                        ) : (
                            <>
                                <input
                                    className="chatRoomCardNameEdit"
                                    value={roomName}
                                    onChange={(e) =>
                                        setRoomName(e.target.value)
                                    }
                                ></input>
                                <ClearIcon
                                    style={{
                                        color: 'white',
                                        position: 'absolute',
                                        right: '10px',
                                        top: '7px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => setShowEditName(false)}
                                />
                            </>
                        )}
                    </div>
                    {(showEditName || image) && (
                        <div className="chatRoomEditButtonContainer">
                            <button
                                onClick={handleEditChatRoomInfo}
                                type="submit"
                                className="chatRoomEditNameSubmit"
                            >
                                Update
                            </button>
                        </div>
                    )}
                </div>
            </form>
        )
    );
};

export default ChatRoomImageCard;
