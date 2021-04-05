import { useState } from 'react';
import MessageDropdown from './MessageDropdown';
import dayjs from 'dayjs';

const Message = ({ message, user }) => {
    const [messageHover, setMessageHover] = useState(false);
    const [showDropdownMenu, setShowDropdownMenu] = useState(false);
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
                <div className="chatRoomMessageBody">{message.body}</div>
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
