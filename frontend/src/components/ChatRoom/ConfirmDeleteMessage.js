import { Modal } from '../../context/Modal';
import { socket } from '../../App';

const ConfirmDeleteMessage = ({ setShowModal, messageId, chatRoomId }) => {
    const handleDeleteMessage = () => {
        const chatMessageList = document.querySelector('.chatRoomMessageList');
        socket.emit('delete message', { messageId, chatRoomId });
        sessionStorage.setItem('chatScrollPosition', chatMessageList.scrollTop);
    };

    return (
        <Modal onClose={() => setShowModal(false)}>
            <div className="confirmContactContainer">
                <div className="confirmContactMessage">
                    Are you sure you want to delete this message?
                </div>
                <div className="confirmContactButtonContainer">
                    <div
                        onClick={handleDeleteMessage}
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
