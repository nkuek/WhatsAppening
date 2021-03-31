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

    socket.on('new room', async (data) => {
        const { name, adminId, image } = data;
        singleMulterUpload('image');
        let profileImageUrl = null;
        if (data.image)
            try {
                profileImageUrl = await singlePublicFileUpload(
                    String(data.image)
                );
            } catch (e) {
                console.error(e);
            }
        console.log(profileImageUrl);
        db.ChatRoom.create({ name, adminId, imageUrl: profileImageUrl });
        socket.emit('created room', { adminId });
    });
});

module.exports = io;
