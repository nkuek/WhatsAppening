import { useDispatch } from 'react-redux';
import SignupFormModal from '../SignupFormModal';
import LoginFormModal from '../LoginFormModal';
import * as sessionActions from '../../store/session';

import './WelcomePage.css';

const WelcomePage = () => {
    const dispatch = useDispatch();
    const handleDemoUser = () => {
        return dispatch(
            sessionActions.login({
                credential: 'demo@user.io',
                password: 'password',
            })
        );
    };

    return (
        <div className="chatRoomMessageList noMessagesContainer">
            <div className="welcomeMessageContainer">
                <div className="welcomeMessage">
                    <div className="callToAction1">Welcome</div>
                    <div className="callToAction2">
                        Login or signup to find out WhatsAppening
                    </div>
                    <div className="logoContainer">
                        <i className="far fa-comment-dots"></i>
                    </div>
                </div>
                <div className="loginSignup">
                    <LoginFormModal />
                    <SignupFormModal />
                    <button className="demoUserButton" onClick={handleDemoUser}>
                        Demo User
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;
