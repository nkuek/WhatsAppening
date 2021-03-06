import { useDispatch } from 'react-redux';
import { Modal } from '../../context/Modal';
import { addContact } from '../../store/userContacts';
import { clearSearchUsers } from '../../store/usersearch';

import './ConfirmContactModal.css';

const ConfirmContactModal = ({ user, setShowModal, setUserSearchInput }) => {
    const dispatch = useDispatch();

    const handleAddContact = () => {
        dispatch(addContact(user.id));
        setShowModal(false);
        setUserSearchInput('');
        document
            .querySelector('.addContactFormContainer')
            .classList.remove('show');
        document.querySelector('.newRoomFormContainer').classList.add('show');
        dispatch(clearSearchUsers());
    };

    return (
        <Modal onClose={() => setShowModal(false)}>
            <div className="confirmContactContainer">
                <div className="confirmContactMessage">
                    Add {user.name} to your contacts?
                </div>
                <div className="confirmContactButtonContainer">
                    <div
                        onClick={handleAddContact}
                        className="confirmContactButton"
                    >
                        Yes
                    </div>
                    <div
                        onClick={() => setShowModal(false)}
                        className="cancelContactButton"
                    >
                        No
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmContactModal;
