import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { Avatar, IconButton } from '@material-ui/core';
import { useMediaQuery } from 'react-responsive';
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';
import EditIcon from '@material-ui/icons/Edit';
import ChatRoomImageCard from './ChatRoomImageCard';
import { editUserRoom } from '../../../store/chatroom';
import './ChatRoomInfo.css';

const ChatRoomInfo = ({ chatRoom }) => {
    const isMobile = useMediaQuery({ query: '(max-width: 950px)' });
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

    useEffect(() => {
        if (showEditName)
            document.querySelector('.chatRoomCardNameEdit').focus();
    }, [showEditName]);

    useEffect(() => {
        if (showEditDescription)
            document.querySelector('.chatRoomCardDescriptionEdit').focus();
    }, [showEditDescription]);

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
        if (isMobile) {
            document
                .querySelector('.chatRoomContainer')
                .classList.remove('hide');
        }
        document
            .querySelector('.chatRoomInfoContainer')
            .classList.remove('display');
        resetForm();
    };

    const handleEditDescription = (e) => {
        e.preventDefault();
        if (description === chatRoom.description) {
            setShowEditDescription(false);
            return;
        }
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
            <form
                onSubmit={handleEditDescription}
                className="chatRoomDescriptionContainer"
            >
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
                                value={description || ''}
                                onChange={(e) => setDescription(e.target.value)}
                            ></input>
                            <CheckIcon
                                style={{
                                    color: 'white',
                                    position: 'absolute',
                                    right: '5px',
                                    top: '0px',
                                    cursor: 'pointer',
                                }}
                                onClick={handleEditDescription}
                            />
                        </>
                    )}
                </div>
            </form>
            <div className="chatRoomParticipantsCard">
                <div className="chatRoomParticipantsLabelContainer">
                    <div className="chatRoomParticipantsLabel">
                        Participants
                    </div>
                </div>
                {chatRoom.participants &&
                    chatRoom.participants
                        .sort((a, b) => {
                            return a.name.toLowerCase() < b.name.toLowerCase()
                                ? -1
                                : 1;
                        })
                        .map((participant) => (
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
