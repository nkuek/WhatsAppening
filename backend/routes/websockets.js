const db = require('../db/models');
const io = require('socket.io')({
    cors: {
        origin: '*',
    },
});

// Keep updated list of users connected to each room
const connectedUsers = {};

io.on('connection', (socket) => {
    // Ensure user is connected to all socket.io rooms
    socket.on('update socket', async (data) => {
        const user = await db.User.findByPk(data.userId);
        socket.user = user;
        const chatRooms = await user.getParticipants();
        const admin = await user.getAdmin();
        const roomIds = chatRooms.map((room) => room.id);
        const adminIds = admin.map((room) => room.id);
        const allRoomIds = [...roomIds, ...adminIds];
        socket.roomIds = allRoomIds;

        allRoomIds.forEach((roomId) => {
            if (!connectedUsers[roomId]) connectedUsers[roomId] = new Set();
        });

        socket.join(allRoomIds);
    });

    // Create new messages in database
    socket.on('new message', async (data) => {
        const { authorId, body, chatRoomId } = data;
        socket.join(chatRoomId);
        await db.Message.create({ body, authorId, chatRoomId });

        const chatRoom = await db.ChatRoom.findByPk(chatRoomId);

        chatRoom.update({ isRead: false });

        // dispatches action to reload chat list
        io.in(chatRoomId).emit('reload chatlist');

        // dispatches action to update chat room messages
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
        socket.roomIds.forEach((roomId) => {
            connectedUsers[roomId].delete(socket.user.id);
        });
        connectedUsers[chatRoomId].add(socket.user.id);

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
