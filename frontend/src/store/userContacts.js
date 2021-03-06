import { fetch } from './csrf';

const sortContacts = (userContacts) => {
    userContacts.sort((a, b) => {
        const first = a.name.toLowerCase();
        const second = b.name.toLowerCase();
        if (first < second) return -1;
        if (first > second) return 1;
        return 0;
    });
    return userContacts;
};

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

    const { userContacts } = response.data;
    sortContacts(userContacts);
    dispatch(getContacts(userContacts));
};

export const findContacts = (userId) => async (dispatch) => {
    const response = await fetch('/api/users/contacts', {
        method: 'PUT',
        body: JSON.stringify({ userId }),
    });

    const { userContacts } = response.data;
    sortContacts(userContacts);

    dispatch(getContacts(userContacts));
};

export const deleteContact = (contactId) => async (dispatch) => {
    const response = await fetch('/api/users/contacts', {
        method: 'DELETE',
        body: JSON.stringify({ contactId }),
    });
    const { userContacts } = response.data;
    sortContacts(userContacts);
    dispatch(getContacts(userContacts));
};

export const removeUserContactsState = () => (dispatch) => {
    dispatch(removeContacts());
};

const initialState = { contacts: null, isLoaded: false };
const contactReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CONTACTS:
            return { ...state, contacts: action.contacts, isLoaded: true };
        case REMOVE_CONTACTS:
            return initialState;
        default:
            return state;
    }
};

export default contactReducer;
