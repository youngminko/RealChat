const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


// Obtain Username and Room from URL
const {username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


const socket = io();

// Join Chatroom
socket.emit('joinRoom', {username, room});

//Get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
})

// Message from the server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // Scroll
    chatMessages.scrollTop = chatMessages.scrollHeight;


})

// Create Event listener for message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;
    
    //console.log(msg);
    // Emit message to the server
    socket.emit('chatMessage',msg);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Output the message to DOM
function outputMessage(msg){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">
        ${msg.text}
    </p>
    </div>`;
document.querySelector('.chat-messages').appendChild(div);
}

// add room name to Dom
function outputRoomName(room){
    roomName.innerText = room;

}

// Add users to DOM
function outputUsers(users){
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}