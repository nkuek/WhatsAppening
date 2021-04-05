import dayjs from 'dayjs';
const ReceivedMessage = ({ message }) => {
    return (
        <div
            id={`message${message.id}`}
            key={message.id}
            className="chatRoomMessageContainer received"
        >
            <div className="chatMessageArrow"></div>
            <div className="chatRoomMessage received">
                <div className="chatRoomMessageText">
                    <div className="chatRoomMessageSender">
                        {message.author}
                    </div>
                    <div className="chatRoomMessageBody">{message.body}</div>
                </div>
                <span className="chatRoomMessageTime">
                    {dayjs(message.createdAt).format('HH:mm')}
                </span>
            </div>
        </div>
    );
};

export default ReceivedMessage;
