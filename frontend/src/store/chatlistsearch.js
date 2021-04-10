import { fetch } from './csrf';

const SET_SEARCH = 'chatListSearch/setSearch';
const RESET_SEARCH = 'chatListSearch/resetSearch';

const setSearch = (searchResults) => ({
    type: SET_SEARCH,
    searchResults,
});

export const resetSearch = () => ({
    type: RESET_SEARCH,
});

export const searchAll = (searchQuery) => async (dispatch) => {
    const response = await fetch('/api/search', {
        method: 'PUT',
        body: JSON.stringify({ searchQuery }),
    });

    const searchResults = response.data;
    dispatch(setSearch(searchResults));
};

const searchReducer = (state = null, action) => {
    switch (action.type) {
        case SET_SEARCH:
            return action.searchResults;
        case RESET_SEARCH:
            return null;
        default:
            return state;
    }
};

export default searchReducer;
