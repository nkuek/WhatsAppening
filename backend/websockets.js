const io = require('socket.io')({
    cors: {
        origin: '*',
    },
});

io.on('connection', (socket) => {
    console.log('a user has connected');
    socket.broadcast.emit('new user');
    socket.on('new message', (data) => {});
});

module.exports = io;
