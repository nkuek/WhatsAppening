import { fetch } from './csrf.js';

export const GET_ROOMS = 'chat/getRooms';

export const getRooms = (rooms) => ({
    type: GET_ROOMS,
    rooms,
});

export const getUserRooms = (userId) => async (dispatch) => {
    const res = await fetch('/api/users', {
        method: 'PUT',
        body: JSON.stringify({ userId }),
    });
    return dispatch(getRooms(res.data.rooms));
};

const initialState = [];
function chatRoomReducer(state = initialState, action) {
    switch (action.type) {
        case GET_ROOMS:
            return action.rooms;
        default:
            return state;
    }
}

export default chatRoomReducer;
