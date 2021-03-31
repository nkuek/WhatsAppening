import { fetch } from './csrf.js';
import imageUploader from './images';

const CREATE_ROOM = 'chatroom/createRoom';

const createRoom = (room) => ({
    type: CREATE_ROOM,
    room,
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

const chatroomReducer = (state = null, action) => {
    switch (action.type) {
        case CREATE_ROOM:
            return action.room;
        default:
            return state;
    }
};

export default chatroomReducer;
