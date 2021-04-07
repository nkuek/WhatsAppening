import { fetch } from './csrf';

const GET_CONTACTS = 'contacts/getContacts';
const REMOVE_CONTACTS = 'contact/clearContacts';

const getContacts = (contacts) => ({
    type: GET_CONTACTS,
    contacts,
});

const removeContacts = () => ({
    type: REMOVE_CONTACTS,
});

export const addContact = (userId) => async (dispatch) => {
    const response = await fetch('/api/users/contacts', {
        method: 'POST',
        body: JSON.stringify({ userId }),
    });

    dispatch(getContacts(response.data.contacts));
};

export const findContacts = (userId) => async (dispatch) => {
    const response = await fetch('/api/users/contacts', {
        method: 'PUT',
        body: JSON.stringify({ userId }),
    });

    const { userContacts } = response.data;
    userContacts.sort((a, b) => {
        const first = a.name.toLowerCase();
        const second = b.name.toLowerCase();
        if (first < second) return -1;
        if (first > second) return 1;
        return 0;
    });

    dispatch(getContacts(response.data.userContacts));
};

export const removeUserContactsState = () => (dispatch) => {
    dispatch(removeContacts());
};

const initialState = { contacts: null, isLoaded: false };
const contactReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CONTACTS:
            return { contacts: [...action.contacts], isLoaded: true };
        case REMOVE_CONTACTS:
            return initialState;
        default:
            return state;
    }
};

export default contactReducer;
