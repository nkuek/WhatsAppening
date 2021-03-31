import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import * as sessionActions from '../../store/session';

const Profile = ({ user }) => {
    const dispatch = useDispatch();
    const logout = (e) => {
        openProfile();
        dispatch(sessionActions.logout());
    };

    const openProfile = () => {
        document.querySelector('.profileContainer').classList.toggle('show');
    };

    return (
        user && (
            <>
                <div className="profileHeader">
                    <IconButton
                        style={{ color: 'white' }}
                        onClick={openProfile}
                    >
                        <KeyboardBackspaceIcon />
                    </IconButton>
                    <div className="profileTitle">Profile</div>
                </div>
                <div className="profileBody">
                    <div className="profilePicture">
                        <img src={user.profileUrl} />
                    </div>
                    <div className="profileInformation">
                        <div className="profileName">Your Name</div>
                        <div className="userName">{user.name}</div>
                    </div>
                    <button onClick={logout} className="profileLogoutButton">
                        Logout
                    </button>
                </div>
            </>
        )
    );
};

export default Profile;
