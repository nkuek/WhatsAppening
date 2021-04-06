import SignupFormModal from '../SignupFormModal';
import LoginFormModal from '../LoginFormModal';

import './WelcomePage.css';

const WelcomePage = () => {
    return (
        <div className="chatRoomMessageList noMessagesContainer">
            <div className="welcomeMessageContainer">
                <div className="welcomeMessage">
                    <div className="callToAction1">Welcome</div>
                    <div className="callToAction2">
                        Login or signup to find out WhatsAppening
                    </div>
                    <div className="logoContainer">
                        <i
                            style={{ fontSize: '5rem' }}
                            class="far fa-comment-dots"
                        ></i>
                    </div>
                </div>
                <div className="loginSignup">
                    <LoginFormModal />
                    <SignupFormModal />
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;
