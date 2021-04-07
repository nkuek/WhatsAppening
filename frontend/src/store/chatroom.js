import { fetch } from './csrf.js';
import imageUploader from './images';

const CREATE_ROOM = 'chatroom/createRoom';
const FIND_ROOM = 'chatroom/findRoom';
const RESET_STATE = 'chatroom/resetChatRoomState';

const createRoom = (room) => ({
    type: CREATE_ROOM,
    room,
});

const findRoom = (room) => ({
    type: FIND_ROOM,
    room,
});

const resetRoom = () => ({
    type: RESET_STATE,
});

export const createNewRoom = (
    roomName,
    adminId,
    image,
    selectedContacts
) => async (dispatch) => {
    let imageUrl;
    if (image) {
        imageUrl = await imageUploader(image);
    }

    const response = await fetch('/api/chatrooms', {
        method: 'POST',
        body: JSON.stringify({ roomName, adminId, imageUrl, selectedContacts }),
    });

    console.log(response.data);
    const room = response.data.chatroom;
    dispatch(createRoom(room));
};

export const findUserRoom = (chatRoomId) => async (dispatch) => {
    const res = await fetch('/api/chatrooms', {
        method: 'PUT',
        body: JSON.stringify({ chatRoomId }),
    });

    const { chatRoom, messagesAndUsers, participants } = res.data;
    chatRoom.messages = messagesAndUsers;
    chatRoom.participants = participants;

    dispatch(findRoom(chatRoom));
};

export const resetUserRoomState = () => (dispatch) => {
    dispatch(resetRoom());
};

export const editUserRoom = (
    chatRoomId,
    roomName,
    description,
    image
) => async (dispatch) => {
    let imageUrl;

    if (image) imageUrl = await imageUploader(image);

    const res = await fetch('/api/chatrooms/edit', {
        method: 'PUT',
        body: JSON.stringify({ chatRoomId, roomName, description, imageUrl }),
    });

    const { chatRoom, messagesAndUsers, participants } = res.data;
    chatRoom.messages = messagesAndUsers;
    chatRoom.participants = participants;

    dispatch(findRoom(chatRoom));
};

const initialState = { room: null, isLoaded: false };
const chatroomReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_ROOM:
            return { room: action.room, isLoaded: true };
        case FIND_ROOM:
            return { room: action.room, isLoaded: true };
        case RESET_STATE:
            return initialState;
        default:
            return state;
    }
};

export default chatroomReducer;
