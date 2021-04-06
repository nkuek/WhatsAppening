import { useDispatch } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import { withStyles } from '@material-ui/styles';
import { Avatar, IconButton } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import ChatRoomImageCard from './ChatRoomImageCard';
import './ChatRoomInfo.css';

const ChatRoomInfo = ({ chatRoom }) => {
    const [description, setDescription] = useState('');
    const [preview, setPreview] = useState(chatRoom && chatRoom.imageUrl);
    const [image, setImage] = useState(null);
    const [roomName, setRoomName] = useState(chatRoom && chatRoom.name);
    const [showEditName, setShowEditName] = useState(false);
    const [showEditDescription, setShowEditDescription] = useState(false);

    useEffect(() => {
        setPreview(chatRoom.imageUrl);
        setRoomName(chatRoom.name);
        setDescription(chatRoom.description);
    }, [chatRoom]);

    const resetForm = () => {
        document.getElementById('chatRoomImageInput').value = '';
        setTimeout(() => {
            setImage('');
            setPreview(chatRoom.imageUrl);
            setRoomName(chatRoom.name);
            setShowEditName(false);
        }, 500);
    };

    const handleCloseChatRoomInfo = () => {
        document
            .querySelector('.chatRoomInfoContainer')
            .classList.remove('display');
        resetForm();
    };

    const handleEditDescription = () => {
        return;
    };

    return (
        <>
            <div className="chatRoomInfoHeaderContainer">
                <IconButton onClick={handleCloseChatRoomInfo}>
                    <ClearIcon style={{ color: 'rgb(163, 163, 163)' }} />
                </IconButton>
                <div className="chatRoomInfoHeader">Group Info</div>
            </div>
            <form>
                <ChatRoomImageCard
                    preview={preview}
                    setPreview={setPreview}
                    image={image}
                    setImage={setImage}
                    roomName={roomName}
                    setRoomName={setRoomName}
                    showEditName={showEditName}
                    setShowEditName={setShowEditName}
                />
                <div className="chatRoomDescriptionContainer">
                    <div className="chatRoomDescriptionLabel">Description</div>
                    <div className="chatRoomDescriptionAndEdit">
                        {!showEditDescription ? (
                            <>
                                <div className="chatRoomDescription">
                                    {chatRoom.description
                                        ? chatRoom.description
                                        : 'Add group description'}
                                </div>
                                <EditIcon
                                    style={{
                                        color: 'rgb(163, 163, 163)',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => setShowEditDescription(true)}
                                />
                            </>
                        ) : (
                            <>
                                <textarea
                                    className="chatRoomCardDescriptionEdit"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                ></textarea>
                                <ClearIcon
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '7px',
                                        color: 'black',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() =>
                                        setShowEditDescription(false)
                                    }
                                />
                            </>
                        )}
                    </div>
                </div>
            </form>
            <div className="chatRoomParticipantsCard">
                <div className="chatRoomParticipantsLabelContainer">
                    <div className="chatRoomParticipantsLabel">
                        Participants
                    </div>
                </div>
                {chatRoom.participants.map((participant) => (
                    <div
                        style={{ margin: '10px 0px', color: 'white' }}
                        className="selectedContactsItem"
                    >
                        <div className="selectedContactInfo">
                            <div className="selectedContactProfileImage">
                                <Avatar src={participant.profileUrl} />
                            </div>
                            <div className="selectedContactName">
                                {participant.name}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default ChatRoomInfo;
