import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import SignupForm from './SignupForm';
import { useDispatch, useSelector } from 'react-redux';
import * as sessionActions from '../../store/session';

function SignupFormModal() {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);

    const session = useSelector((state) => state.sesion);

    const handleClose = () => {
        if (session.user) dispatch(sessionActions.loadUserState());
        else dispatch(sessionActions.unloadUserState());
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
