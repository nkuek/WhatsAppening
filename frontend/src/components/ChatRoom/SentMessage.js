import { useState } from 'react';
import MessageDropdown from './MessageDropdown';
import dayjs from 'dayjs';

const Message = ({ message }) => {
    const [messageHover, setMessageHover] = useState(false);
    const [showDropdownMenu, setShowDropdownMenu] = useState(false);
    const linkRegEx = /((http|ftp|https):\/\/)?([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g;

    return (
        <div
            id={`message${message.id}`}
            key={message.id}
            className="chatRoomMessageContainer sent"
        >
            <div
                onMouseEnter={() => {
                    setMessageHover(true);
                }}
                onMouseLeave={() => {
                    if (!showDropdownMenu) setMessageHover(false);
                }}
                className={`chatRoomMessage sent`}
            >
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
                    <div className="chatRoomMessageBody">{message.body}</div>
                )}
                <span className="chatRoomMessageTime">
                    {dayjs(message.createdAt).format('HH:mm')}
                </span>
            </div>
            <span
                onMouseEnter={() => {
                    setMessageHover(true);
                }}
                onMouseLeave={() => {
                    if (!showDropdownMenu) setMessageHover(false);
                }}
                className="messageDropdown"
            >
                {messageHover && (
                    <MessageDropdown
                        chatRoomId={message.chatRoomId}
                        showDropdownMenu={showDropdownMenu}
                        setShowDropdownMenu={setShowDropdownMenu}
                        messageId={message.id}
                        setMessageHover={setMessageHover}
                    />
                )}
            </span>
        </div>
    );
};

export default Message;
