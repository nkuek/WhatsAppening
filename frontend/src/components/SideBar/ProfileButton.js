import { IconButton } from '@material-ui/core';

function ProfileButton({ user }) {
    return (
        <div className="profileButtonContainer">
            <IconButton>
                {user && user.profileUrl ? (
                    <img className="userProfilePicture" src={user.profileUrl} />
                ) : (
                    <i
                        style={{ color: '#B1B3B5' }}
                        className="fas fa-user-circle"
                    />
                )}
            </IconButton>
        </div>
    );
}

export default ProfileButton;
