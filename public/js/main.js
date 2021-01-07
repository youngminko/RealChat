const chatForm = document.getElementById('chat-form');

const socket = io();

// Message from the server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);
})

// Create Event listener for message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;
    
    //console.log(msg);
    // Emit message to the server
    socket.emit('chatMessage',msg);
});

// Output the message to DOM
function outputMessage(msg){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `						<p class="meta">Mary <span>9:15pm</span></p>
    <p class="text">
        ${msg}
    </p>
</div>`;
document.querySelector('.chat-messages').appendChild(div);
}