import { Avatar } from '@material-ui/core';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';

function ProfileButton() {
    const [isLoaded, setIsLoaded] = useState(false);
    const user = useSelector((state) => state.session.user);

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
                    <Avatar src={user.profileUrl && user.profileUrl} />
                </IconButton>
            </div>
        )
    );
}

export default ProfileButton;
