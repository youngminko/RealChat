const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname,'public')));

const botName = 'RealChat Bot';
// Run when client connects
io.on('connection', socket => {

    socket.on('joinRoom', ({username, room}) => {

        // Gets the id of the user
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        // Welcome Message
        socket.emit('message', formatMessage(botName, 'Weclome to RealChat!'));

        // When a user connects, broadcast
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chatroom.`));
        //general 
        //io.emit()

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });


    });

    

   

    // Listen for a chat message
    socket.on('chatMessage', msg => {
        // Get current user
        const user = getCurrentUser(socket.id);

        io.emit('message', formatMessage(user.username, msg));
    });

     // When user disconnects
     socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chatroom.`));


            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});
const PORT = 3000 || process.env.PORT;
//backticks for template literal strings: represent multline string and use interpolation to insert variables
server.listen(PORT, () => console.log(`server running on port ${PORT}`));
