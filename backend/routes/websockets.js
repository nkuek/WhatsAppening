const db = require('../db/models');
const io = require('socket.io')({
    cors: {
        origin: '*',
    },
});

io.on('connection', (socket) => {
    socket.on('update socket', async (data) => {
        const user = await db.User.findByPk(data.userId);
        const chatRooms = await user.getParticipants();
        const roomIds = chatRooms.map((room) => room.id);
        console.log('joining', roomIds);

        socket.join(roomIds);
    });

    socket.on('new message', async (data) => {
        const { authorId, body, chatRoomId } = data;
        socket.join(chatRoomId);
        await db.Message.create({ body, authorId, chatRoomId });

        const chatRoom = await db.ChatRoom.findByPk(chatRoomId);

        chatRoom.update({ isRead: false });

        io.in(chatRoomId).emit('load messages', { chatRoomId });
    });

    socket.on('delete message', async (data) => {
        const { messageId, chatRoomId } = data;
        const message = await db.Message.findByPk(messageId);
        const chatRoom = await db.ChatRoom.findByPk(chatRoomId);
        await chatRoom.removeMessage(messageId);
        message.destroy();
        socket.emit('load messages', { chatRoomId });
    });

    socket.on('read message', async (data) => {
        const { chatRoomId } = data;
        const chatRoom = await db.ChatRoom.findByPk(chatRoomId);
        chatRoom.update({ isRead: true });
        socket.emit('reload chatlist');
    });

    socket.on('user logged in', (data) => {
        socket.emit('load rooms', { userId: data.userId });
    });

    socket.on('new room', async (data) => {
        io.emit('created room', { adminId: data.adminId });
    });
});

module.exports = io;
