import { fetch } from './csrf';

const FIND_USERS = 'users/findUsers';

const findUsers = (users) => ({
    type: findUsers,
    users,
});

export const searchUsers = (searchInput) => async (dispatch) => {
    const response = await fetch('/api/users/search', {
        method: 'PUT',
        body: JSON.stringify({ searchInput }),
    });

    dispatch(response.data.users);
};

const initialState = { users: null, isLoaded: false };
const userSearchReducer = (state = initialState, action) => {
    switch (action.type) {
        case FIND_USERS:
            return { ...state, users: action.users };
        default:
            return state;
    }
};

export default userSearchReducer;
