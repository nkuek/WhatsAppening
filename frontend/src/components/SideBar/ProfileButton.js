import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';

function ProfileButton() {
    const [isLoaded, setIsLoaded] = useState(false);
    const user = useSelector((state) => state.session.user);
    console.log(user);

    useEffect(() => {
        if (user) setIsLoaded(true);
    }, [user]);

    const openProfile = () => {
        document.querySelector('.profileContainer').classList.toggle('show');
    };
    return (
        isLoaded && (
            <div className="profileButtonContainer">
                <IconButton onClick={openProfile}>
                    {user.profileUrl ? (
                        <img
                            className="userProfilePicture"
                            src={user.profileUrl}
                        />
                    ) : (
                        <img
                            className="userProfilePicture default"
                            src={
                                'https://qph.fs.quoracdn.net/main-qimg-2b21b9dd05c757fe30231fac65b504dd'
                            }
                        />
                    )}
                </IconButton>
            </div>
        )
    );
}

export default ProfileButton;
