import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import SignupForm from './SignupForm';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';

function SignupFormModal() {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);

    const handleClose = () => {
        dispatch(sessionActions.restoreUser());
        setShowModal(false);
    };

    return (
        <>
            <button className="signupButton" onClick={() => setShowModal(true)}>
                Sign up
            </button>
            {showModal && (
                <Modal onClose={handleClose}>
                    <SignupForm
                        showModal={showModal}
                        setShowModal={setShowModal}
                    />
                </Modal>
            )}
        </>
    );
}

export default SignupFormModal;
