import { fetch } from './csrf.js';

const GET_ROOMS = 'chat/getRooms';
const REMOVE_ROOMS = 'chat/removeRooms';

const getRooms = (rooms) => ({
    type: GET_ROOMS,
    rooms,
});

const removeRooms = () => ({
    type: REMOVE_ROOMS,
});

export const getUserRooms = (userId) => async (dispatch) => {
    const res = await fetch('/api/users/chatrooms', {
        method: 'PUT',
        body: JSON.stringify({ userId }),
    });
    return dispatch(getRooms(res.data.rooms));
};

export const removeUserRooms = () => (dispatch) => {
    dispatch(removeRooms());
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
