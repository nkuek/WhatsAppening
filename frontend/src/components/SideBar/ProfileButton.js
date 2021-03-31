import { IconButton } from '@material-ui/core';

function ProfileButton({ user }) {
    const openProfile = () => {
        document.querySelector('.profileContainer').classList.toggle('show');
    };
    return (
        <div className="profileButtonContainer">
            {user && user.profileUrl ? (
                <IconButton onClick={openProfile}>
                    <img className="userProfilePicture" src={user.profileUrl} />
                </IconButton>
            ) : (
                <i
                    style={{ color: '#B1B3B5' }}
                    className="fas fa-user-circle"
                />
            )}
        </div>
    );
}

export default ProfileButton;
