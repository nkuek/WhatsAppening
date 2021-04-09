import { fetch } from './csrf.js';

const GET_ROOMS = 'chat/getRooms';
const REMOVE_ROOMS = 'chat/clearChatList';

const getRooms = (rooms) => ({
    type: GET_ROOMS,
    rooms,
});

const removeRooms = () => ({
    type: REMOVE_ROOMS,
});

export const getUserRooms = (userId) => async (dispatch) => {
    console.log('dispatching');
    const res = await fetch('/api/users/chatrooms', {
        method: 'PUT',
        body: JSON.stringify({ userId }),
    });
    const { rooms } = res.data;

    return dispatch(getRooms(rooms));
};

export const removeUserRooms = () => (dispatch) => {
    dispatch(removeRooms());
};

export const deleteUserRoom = (chatRoomId) => async (dispatch) => {
    const response = await fetch('/api/users/chatrooms', {
        method: 'DELETE',
        body: JSON.stringify({ chatRoomId }),
    });
    const { rooms } = response.data;
    return dispatch(getRooms(rooms));
};

const initialState = [];
function chatListReducer(state = initialState, action) {
    switch (action.type) {
        case GET_ROOMS:
            return action.rooms;
        case REMOVE_ROOMS:
            return initialState;
        default:
            return state;
    }
}

export default chatListReducer;
