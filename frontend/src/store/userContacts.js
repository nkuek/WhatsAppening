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

    console.log(response);
    // dispatch(getContacts())
};
