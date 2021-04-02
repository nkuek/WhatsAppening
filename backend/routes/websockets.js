const db = require('../db/models');
const io = require('socket.io')({
    cors: {
        origin: '*',
    },
});

io.on('connection', (socket) => {
    socket.emit('new user');

    socket.on('new message', (data) => {
        const { name, authorId, body, chatRoomId } = data;
        socket.join(chatRoomId);
        db.Message.create({ body, authorId, chatRoomId });
        io.to(chatRoomId).emit('load messages', { chatRoomId });
        io.emit('reload chatlist');
    });

    socket.on('user logged in', (data) => {
        socket.emit('load rooms', { userId: data.userId });
    });

    socket.on('new room', async (data) => {
        socket.emit('created room', { adminId: data.adminId });
    });
});

module.exports = io;
