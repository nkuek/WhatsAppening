import { useDispatch } from 'react-redux';
import { Modal } from '../../context/Modal';
import { addContact } from '../../store/userContacts';

import './ConfirmContactModal.css';

const ConfirmContactModal = ({ user, setShowModal }) => {
    const dispatch = useDispatch();

    const handleAddContact = () => {
        dispatch(addContact(user.id));
        setShowModal(false);
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
