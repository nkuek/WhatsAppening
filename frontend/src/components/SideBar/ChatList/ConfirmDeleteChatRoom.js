import { useDispatch } from 'react-redux';
import { Modal } from '../../../context/Modal';
import { deleteUserRoom } from '../../../store/chatlist';
import { resetUserRoomState } from '../../../store/chatroom';

const ConfirmDeleteMessage = ({
    setShowModal,
    chatRoomId,
    setSelectedItem,
}) => {
    const dispatch = useDispatch();
    const handleDeleteChatRoom = (e) => {
        e.stopPropagation();
        setSelectedItem('');
        dispatch(deleteUserRoom(chatRoomId));
        dispatch(resetUserRoomState());
    };

    return (
        <Modal onClose={() => setShowModal(false)}>
            <div className="confirmContactContainer">
                <div className="confirmContactMessage">
                    Are you sure you want to delete this chat room?
                </div>
                <div className="confirmContactButtonContainer">
                    <div
                        onClick={handleDeleteChatRoom}
                        className="confirmContactButton"
                    >
                        Yes
                    </div>
                    <div
                        onClick={() => setShowModal(false)}
                        className="cancelContactButton"
                    >
                        No
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmDeleteMessage;
