import { fetch } from './csrf.js';
import imageUploader from './images';
import { socket } from '../App';

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';
const LOAD_USER = 'session/loadUser';
const UNLOAD_USER = 'session/unloadUser';

const setUser = (user) => ({
    type: SET_USER,
    payload: user,
});

const removeUser = () => ({
    type: REMOVE_USER,
});

const loadUser = () => ({
    type: LOAD_USER,
});

const unloadUser = () => ({
    type: UNLOAD_USER,
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
    dispatch(unloadUser());
    return dispatch(setUser(res.data.user));
};

export const loadUserState = () => (dispatch) => {
    dispatch(loadUser());
};

export const unloadUserState = () => (dispatch) => {
    dispatch(unloadUser());
};

export const addProfilePicture = (image) => async (dispatch) => {
    const imageUrl = await imageUploader(image);
    const res = await fetch('/api/users', {
        method: 'PUT',
        body: JSON.stringify({ imageUrl }),
    });

    dispatch(loadUser());
    dispatch(setUser(res.data.user));
};

export const logout = () => async (dispatch) => {
    const response = await fetch('/api/session', {
        method: 'DELETE',
    });
    dispatch(removeUser());
    return response;
};

export const editUserProfile = (name, image, isPublic) => async (dispatch) => {
    let imageUrl;
    if (image) imageUrl = await imageUploader(image);
    const response = await fetch('/api/users/edit', {
        method: 'PUT',
        body: JSON.stringify({ name, imageUrl, isPublic }),
    });
    dispatch(setUser(response.data.user));
};

export const editUserPrivacy = (isPublic) => async (dispatch) => {
    const response = await fetch('/api/users/edit', {
        method: 'PUT',
        body: JSON.stringify({ isPublic }),
    });
    dispatch(setUser(response.data.user));
};

const initialState = { user: null, contacts: [], isLoaded: false };

function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.payload };
        case REMOVE_USER:
            return { ...state, user: null, contacts: [] };
        case LOAD_USER:
            return { ...state, isLoaded: true };
        case UNLOAD_USER:
            return { ...state, isLoaded: false };
        default:
            return state;
    }
}

export default reducer;
