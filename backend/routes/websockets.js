const db = require('../db/models');
const io = require('socket.io')({
    cors: {
        origin: '*',
    },
});

io.on('connection', (socket) => {
    console.log('a user has connected');
    socket.broadcast.emit('new user');
    socket.on('new message', (data) => {
        const { name, authorId, body, chatRoomId } = data;
        socket.join(chatRoomId);
        socket.to(chatRoomId).emit();
        db.Message.create({ body, authorId, chatRoomId });
        console.log(name, body, chatRoomId);
    });
});

module.exports = io;
