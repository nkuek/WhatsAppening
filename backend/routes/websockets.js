const { singleMulterUpload, singlePublicFileUpload } = require('../awsS3');
const db = require('../db/models');
const io = require('socket.io')({
    cors: {
        origin: '*',
    },
});

// io.use(singleMulterUpload('image'));

io.on('connection', (socket) => {
    console.log('a user has connected');

    socket.emit('new user');

    socket.on('new message', (data) => {
        const { name, authorId, body, chatRoomId } = data;
        socket.join(chatRoomId);
        socket.to(chatRoomId).emit();
        db.Message.create({ body, authorId, chatRoomId });
        console.log(name, body, chatRoomId);
    });

    socket.on('user logged in', (data) => {
        console.log(data);
        socket.emit('load rooms', { userId: data.userId });
    });

    socket.on('new room', async (data) => {
        socket.emit('created room', { adminId: data.adminId });
    });
});

module.exports = io;
