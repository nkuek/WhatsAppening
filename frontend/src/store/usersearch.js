import { fetch } from './csrf';

const FIND_USERS = 'users/findUsers';
const CLEAR_STATE = 'users/resetSearch';

const findUsers = (users) => ({
    type: FIND_USERS,
    users,
});

const clearState = () => ({
    type: CLEAR_STATE,
});

export const searchUsers = (searchInput) => async (dispatch) => {
    const response = await fetch('/api/users/search', {
        method: 'PUT',
        body: JSON.stringify({ searchInput }),
    });

    dispatch(findUsers(response.data.results));
};

export const clearSearchUsers = () => (dispatch) => {
    dispatch(clearState());
};

const initialState = { users: null, isLoaded: false };
const userSearchReducer = (state = initialState, action) => {
    switch (action.type) {
        case FIND_USERS:
            return { ...state, users: action.users, isLoaded: true };
        case CLEAR_STATE:
            return initialState;
        default:
            return state;
    }
};

export default userSearchReducer;
