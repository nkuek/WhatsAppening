import { fetch } from './csrf.js';
import imageUploader from './images';
import { socket } from '../App';

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

const setUser = (user) => ({
    type: SET_USER,
    payload: user,
});

const removeUser = () => ({
    type: REMOVE_USER,
});

export const login = ({ credential, password }) => async (dispatch) => {
    const res = await fetch('/api/session', {
        method: 'POST',
        body: JSON.stringify({ credential, password }),
    });
    dispatch(setUser(res.data.user));
    return res;
};

export const restoreUser = () => async (dispatch) => {
    const res = await fetch('/api/session');
    dispatch(setUser(res.data.user));
    return res;
};

export const signup = (user) => async (dispatch) => {
    const { name, phoneNumber, email, password, confirmPassword } = user;

    const res = await fetch(`/api/users/`, {
        method: 'POST',
        body: JSON.stringify({
            name,
            phoneNumber,
            email,
            password,
            confirmPassword,
        }),
    });
};

export const addProfilePicture = (image) => async (dispatch) => {
    const imageUrl = await imageUploader(image);
    console.log(imageUrl);
    const res = await fetch('/api/users', {
        method: 'PUT',
        body: JSON.stringify({ imageUrl }),
    });

    dispatch(setUser(res.data));
};

export const logout = () => async (dispatch) => {
    const response = await fetch('/api/session', {
        method: 'DELETE',
    });
    dispatch(removeUser());
    return response;
};

const initialState = { user: null, contacts: [] };

function reducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case SET_USER:
            newState = Object.assign({}, state, { user: action.payload });
            return newState;
        case REMOVE_USER:
            return initialState;
        default:
            return state;
    }
}

export default reducer;
