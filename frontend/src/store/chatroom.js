import { fetch } from './csrf.js';
import imageUploader from './images';

const CREATE_ROOM = 'chatroom/createRoom';
const FIND_ROOM = 'chatroom/findRoom';
const RESET_STATE = 'chatroom/resetState';

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

export const createNewRoom = (roomName, adminId, image) => async (dispatch) => {
    let imageUrl;
    if (image) {
        imageUrl = await imageUploader(image);
    }

    const response = await fetch('/api/chatrooms', {
        method: 'POST',
        body: JSON.stringify({ roomName, adminId, imageUrl }),
    });

    const room = response.data;
    dispatch(createRoom(room));
    return room;
};

export const findUserRoom = (chatRoomId) => async (dispatch) => {
    const res = await fetch('/api/chatrooms', {
        method: 'PUT',
        body: JSON.stringify({ chatRoomId }),
    });

    const { chatRoom, messagesAndUsers } = res.data;
    chatRoom.messages = messagesAndUsers;

    dispatch(findRoom(chatRoom));
};

export const resetUserRoomState = () => (dispatch) => {
    dispatch(resetRoom());
};

const chatroomReducer = (state = null, action) => {
    switch (action.type) {
        case CREATE_ROOM:
            return action.room;
        case FIND_ROOM:
            return action.room;
        case RESET_STATE:
            return null;
        default:
            return state;
    }
};

export default chatroomReducer;
