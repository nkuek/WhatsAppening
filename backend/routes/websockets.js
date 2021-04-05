const db = require('../db/models');
const io = require('socket.io')({
    cors: {
        origin: '*',
    },
});

io.on('connection', (socket) => {
    socket.emit('new user');

    socket.on('new message', async (data) => {
        const { name, authorId, body, chatRoomId } = data;
        socket.join(chatRoomId);
        db.Message.create({ body, authorId, chatRoomId });

        const chatRoom = await db.ChatRoom.findByPk(chatRoomId);

        chatRoom.update({ isRead: false });

        io.to(chatRoomId).emit('load messages', { chatRoomId });
        io.emit('reload chatlist');
    });

    socket.on('delete message', async (data) => {
        const { messageId, chatRoomId } = data;
        console.log(messageId);
        const message = await db.Message.findByPk(messageId);
        const chatRoom = await db.ChatRoom.findByPk(chatRoomId);
        await chatRoom.removeMessage(messageId);
        message.destroy();
        // io.to(chatRoomId).emit('load messages', { chatRoomId });
        io.emit('load messages', { chatRoomId });
    });

    socket.on('read message', async (data) => {
        const { chatRoomId } = data;
        console.log('reading');
        const chatRoom = await db.ChatRoom.findByPk(chatRoomId);
        chatRoom.update({ isRead: true });
        socket.emit('reload chatlist');
    });

    socket.on('user logged in', (data) => {
        socket.emit('load rooms', { userId: data.userId });
    });

    socket.on('new room', async (data) => {
        socket.emit('created room', { adminId: data.adminId });
    });
});

module.exports = io;
