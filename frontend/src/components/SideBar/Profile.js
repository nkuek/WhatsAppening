import { IconButton } from '@material-ui/core';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

const Profile = ({ setShowProfile, user }) => {
    const fullName = `${user.firstName} ${user.lastName}`;
    return (
        <div className="profileContainer">
            <div className="profileHeader">
                <IconButton
                    style={{ color: 'white' }}
                    onClick={() => setShowProfile(false)}
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
                    <div className="userName">{fullName}</div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
