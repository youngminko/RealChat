const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname,'public')));

// Run when client connects
io.on('connection', socket => {
    console.log('new connection...');

    socket.emit('message', 'Weclome to RealChat!');

    // When a user connects, broadcast
    socket.broadcast.emit('message', 'User has joined the chatroom.');
    //general 
    //io.emit()

    // When user disconnects
    socket.on('disconnect', () => {
        io.emit('message', 'User has left the chatroom.');
    });

    // Listen for a chat message
    socket.on('chatMessage', msg => {
        //console.log(msg);
        io.emit('message', msg);
    })
});
const PORT = 3000 || process.env.PORT;
//backticks for template literal strings: represent multline string and use interpolation to insert variables
server.listen(PORT, () => console.log(`server running on port ${PORT}`));
