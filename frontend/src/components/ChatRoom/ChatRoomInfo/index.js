import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { Avatar, IconButton } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import ChatRoomImageCard from './ChatRoomImageCard';
import { editUserRoom } from '../../../store/chatroom';
import './ChatRoomInfo.css';

const ChatRoomInfo = ({ chatRoom }) => {
    const dispatch = useDispatch();
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
            setShowEditDescription(false);
        }, 500);
    };

    const handleCloseChatRoomInfo = () => {
        document
            .querySelector('.chatRoomInfoContainer')
            .classList.remove('display');
        resetForm();
    };

    const handleEditDescription = (e) => {
        e.preventDefault();
        dispatch(editUserRoom(chatRoom.id, roomName, description));
        setShowEditDescription(false);
    };

    return (
        <>
            <div className="chatRoomInfoHeaderContainer">
                <IconButton onClick={handleCloseChatRoomInfo}>
                    <ClearIcon style={{ color: 'rgb(163, 163, 163)' }} />
                </IconButton>
                <div className="chatRoomInfoHeader">Group Info</div>
            </div>
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
            <form className="chatRoomDescriptionContainer">
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
                            <input
                                className="chatRoomCardDescriptionEdit"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></input>
                            <ClearIcon
                                style={{
                                    position: 'absolute',
                                    right: '5px',
                                    top: '0px',
                                    color: 'black',
                                    cursor: 'pointer',
                                }}
                                onClick={() => setShowEditDescription(false)}
                            />
                        </>
                    )}
                </div>
                {showEditDescription && (
                    <div className="chatRoomEditButtonContainer">
                        <button
                            onClick={handleEditDescription}
                            style={{ fontSize: '16px' }}
                            type="submit"
                            className="chatRoomEditNameSubmit"
                        >
                            Update
                        </button>
                    </div>
                )}
            </form>
            <div className="chatRoomParticipantsCard">
                <div className="chatRoomParticipantsLabelContainer">
                    <div className="chatRoomParticipantsLabel">
                        Participants
                    </div>
                </div>
                {chatRoom.participants &&
                    chatRoom.participants.map((participant) => (
                        <div
                            key={participant.id}
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
