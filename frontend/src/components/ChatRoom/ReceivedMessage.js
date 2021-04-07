import dayjs from 'dayjs';
const ReceivedMessage = ({ message }) => {
    const linkRegEx = /((http|ftp|https):\/\/)?([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g;
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
                    {linkRegEx.test(message.body) ? (
                        <a
                            className="chatRoomMessageBody"
                            target="_blank"
                            rel="noreferrer"
                            href={
                                !message.body.includes('https') ||
                                !message.body.includes('http')
                                    ? 'https://' + message.body
                                    : message.body
                            }
                        >
                            {message.body}
                        </a>
                    ) : (
                        <div className="chatRoomMessageBody">
                            {message.body}
                        </div>
                    )}
                </div>
                <span className="chatRoomMessageTime">
                    {dayjs(message.createdAt).format('HH:mm')}
                </span>
            </div>
        </div>
    );
};

export default ReceivedMessage;
