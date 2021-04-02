import { fetch } from './csrf';

const GET_CONTACTS = 'contacts/getContacts';

const getContacts = (contacts) => ({
    type: GET_CONTACTS,
    contacts,
});

export const addContact = (userId) => async (dispatch) => {
    const response = await fetch('/api/users/contacts', {
        method: 'POST',
        body: JSON.stringify({ userId }),
    });

    dispatch(getContacts(response.data.contacts));
};

const initialState = { contacts: null, isLoaded: false };
const contactReducer = (state = null, action) => {
    switch (action.type) {
        case GET_CONTACTS:
            return { ...action.contacts, isLoaded: true };
        default:
            return state;
    }
};

export default contactReducer;
